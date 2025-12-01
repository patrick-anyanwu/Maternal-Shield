from django.urls import path
from .views import homepage, HelloAPI, StoryDataAPIView, InfoCardListAPIView

urlpatterns = [
    path('', homepage),
    path('hello/', HelloAPI.as_view()),
    path('story-data/', StoryDataAPIView.as_view()),
    path('info-cards/', InfoCardListAPIView.as_view()), 
]
