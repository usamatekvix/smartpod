from django.urls import path
from .views import VideoUploadView, VideoUpdateView

urlpatterns = [
    path("upload/", VideoUploadView.as_view(), name="video-upload"),
    path("update/<int:pk>/", VideoUpdateView.as_view(), name="video-update"),
]
