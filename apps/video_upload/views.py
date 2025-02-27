from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.conf import settings
import os

from .processing import convert_video_to_text
from .models import Transcript
from .serializers import TranscriptSerializer


class VideoUploadView(APIView):
    def post(self, request):
        video_file = request.FILES.get("videoFile")
        category = request.data.get("categoryName", "Unknown")

        if not video_file:
            return Response({"error": "No video file provided"}, status=400)

        # Save video locally
        video_path = os.path.join(settings.MEDIA_ROOT, "videos", video_file.name)
        os.makedirs(os.path.dirname(video_path), exist_ok=True)
        with open(video_path, "wb") as f:
            for chunk in video_file.chunks():
                f.write(chunk)


        transcript = convert_video_to_text(video_path)
        transcript_instance = Transcript.objects.create(
            category=category,
            video_name=video_file.name,
            transcription=transcript
        )
        serializer = TranscriptSerializer(transcript_instance)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


