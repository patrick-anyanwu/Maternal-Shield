from rest_framework import serializers
from .models import Characters, Scenes, Options
from .models import InfoCard

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Options
        fields = ['text', 'feedback', 'emotion', 'correct']

class SceneSerializer(serializers.ModelSerializer):
    options = OptionSerializer(source='options_set', many=True, read_only=True)

    class Meta:
        model = Scenes
        fields = ['scene_key', 'question', 'options']

class StoryDataSerializer(serializers.Serializer):
    character = serializers.SerializerMethodField()
    scenes = serializers.SerializerMethodField()

    def get_character(self, obj):
        character = Characters.objects.first()
        return {
            "name": character.name,
            "age": character.age,
            "location": character.location
        }

    def get_scenes(self, obj):
        scenes = Scenes.objects.all()
        scene_map = {}
        for scene in scenes:
            options = Options.objects.filter(scene=scene)
            scene_map[scene.scene_key] = {
                "question": scene.question,
                "options": [
                    {
                        "text": opt.text,
                        "feedback": opt.feedback,
                        "emotion": opt.emotion,
                        "correct": opt.correct
                    } for opt in options
                ]
            }
        return scene_map

class InfoCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoCard
        fields = '__all__'