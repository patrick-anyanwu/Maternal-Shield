from django.urls import path
from .views import HelloAPI  # or whatever your view is called

urlpatterns = [
    path('hello/', HelloAPI.as_view()),
]
