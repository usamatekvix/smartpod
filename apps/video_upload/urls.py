from django.urls import path
from .views import VideoUploadView, VideoUpdateView, UserTranscriptListView

urlpatterns = [
    path("upload/", VideoUploadView.as_view(), name="video-upload"),
    path("update/<int:pk>/", VideoUpdateView.as_view(), name="video-update"),
    path("view/", UserTranscriptListView.as_view(), name="transcription-list"),
]
