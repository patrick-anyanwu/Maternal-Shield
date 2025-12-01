from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from .models import Characters, Scenes, Options, InfoCard
from .serializers import StoryDataSerializer, InfoCardSerializer
import joblib
import os

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'relevance_model.pkl')
model = joblib.load(MODEL_PATH)

# ML prediction utility
def predict_relevance(user_inputs, article):
    input_dict = {
        "age_group": user_inputs.get("age_group", ""),
        "trimester": user_inputs.get("trimester", ""),
        "concern": user_inputs.get("concern", ""),
        "heat_sensitive": article.heat_sensitive,
        "pollution_sensitive": article.pollution_sensitive,
    }
    return model.predict([input_dict])[0]  # ✅ single dict wrapped in a list

# Updated StoryData API – now supports character_id query param
class StoryDataAPIView(APIView):
    def get(self, request):
        character_id = request.GET.get('character_id')

        if not character_id:
            return Response({'error': 'character_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            character = Characters.objects.get(id=character_id)
        except Characters.DoesNotExist:
            return Response({'error': 'Character not found'}, status=status.HTTP_404_NOT_FOUND)

        scenes = Scenes.objects.filter(character=character)
        data = {
            "character": {
                "name": character.name,
                "age": character.age,
                "location": character.location,
            },
            "scenes": {
                scene.scene_key: {
                    "question": scene.question,
                    "options": [
                        {
                            "text": opt.text,
                            "feedback": opt.feedback,
                            "emotion": opt.emotion,
                            "correct": opt.correct
                        }
                        for opt in Options.objects.filter(scene=scene)
                    ]
                }
                for scene in scenes
            }
        }

        return Response(data)

class InfoCardListAPIView(APIView):
    def get(self, request):
        trimester = request.GET.get('trimester', '')
        age_range = request.GET.get('age_range', '')
        concern = request.GET.get('concern', '').lower()

        user_input = {
            "age_group": age_range,
            "trimester": trimester,
            "concern": concern
        }

        queryset = InfoCard.objects.all()

        if trimester:
            queryset = queryset.filter(trimester=trimester)

        if age_range:
            queryset = queryset.filter(age_group=age_range)

        if concern in ['heat', 'heatwave']:
            queryset = queryset.filter(heat_sensitive=True)
        if concern in ['pollution', 'air_pollution']:
            queryset = queryset.filter(pollution_sensitive=True)

        articles_with_scores = []
        for article in queryset:
            serialized = InfoCardSerializer(article).data
            try:
                score = predict_relevance(user_input, article)
            except Exception as e:
                score = 0  # fallback score
                print(f"Prediction failed for article {article.id}: {e}")
            serialized["relevance_score"] = round(score, 2)
            articles_with_scores.append(serialized)

        sorted_data = sorted(articles_with_scores, key=lambda x: x["relevance_score"], reverse=True)
        return Response(sorted_data)

# Hello API (unchanged)
class HelloAPI(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})

# Homepage (unchanged)
def homepage(request):
    return HttpResponse("Welcome to Maternal Health App 🍼")
