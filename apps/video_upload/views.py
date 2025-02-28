import logging
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from .models import Transcript
from .serializers import TranscriptSerializer
from .processing import convert_video_to_text
from .utils import save_uploaded_file, delete_files

logger = logging.getLogger(__name__)

class VideoUploadView(APIView):
    def post(self, request):
        video_file = request.FILES.get("videoFile")
        category = request.data.get("categoryName", "Unknown")

        if not video_file:
            return Response({"error": "No video file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save video locally
            video_path = save_uploaded_file(video_file, "videos")

            # Convert video to text
            transcript = convert_video_to_text(video_path)

            # Save transcription to DB
            transcript_instance = Transcript.objects.create(
                category=category,
                video_name=video_file.name,
                transcription=transcript
            )
            serializer = TranscriptSerializer(transcript_instance)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error processing video: {e}")
            return Response({"error": "An error occurred while processing the video"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        finally:
            # Delete video and corresponding audio file
            audio_path = os.path.join(settings.MEDIA_ROOT, "audios", os.path.splitext(video_file.name)[0] + ".mp3")
            delete_files([video_path, audio_path])



