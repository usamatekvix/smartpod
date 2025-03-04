import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from .models import Transcript
from .serializers import TranscriptSerializer
from .processing import convert_video_to_text
from .utils import save_uploaded_file, delete_file


logger = logging.getLogger(__name__)


class VideoUploadView(APIView):
    def post(self, request):
        categoryName = request.data.get("categoryName", "Unknown")
        video_file = request.FILES.get("videoFile")
        video_url = request.data.get("url")

        if not video_file and not video_url:
            return Response({"error": "No video file or URL  provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save video locally
            video_path = save_uploaded_file(video_file, "videos")

            # Convert video to text
            transcript = convert_video_to_text(video_path)

            # Save transcription to DB
            transcript_instance = Transcript.objects.create(
                categoryName=categoryName,
                video_name=video_file.name,
                video_url=video_url,
                transcription=transcript
            )
            serializer = TranscriptSerializer(transcript_instance)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error processing video: {e}")
            return Response({"error": "An error occurred while processing the video"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        finally:
            # Delete video
            delete_file(video_path)


class VideoUpdateView(APIView):
    def put(self, request, pk):

        try:
            transcript_instance = Transcript.objects.get(id=pk)
        except Transcript.DoesNotExist:
            return Response({"error": "Transcript not found"}, status=status.HTTP_404_NOT_FOUND)

        video_file = request.FILES.get("videoFile")
        categoryName = request.data.get("categoryName", transcript_instance.categoryName)
        video_url = request.data.get("url", transcript_instance.video_url)

        if not video_file:
            return Response({"error": "No video file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save new video locally
            video_path = save_uploaded_file(video_file, "videos")

            # Convert new video to text
            transcript = convert_video_to_text(video_path)

            # Ensure transcript is a string
            if isinstance(transcript, list):
                transcript = " ".join(transcript)
            elif transcript is None:
                transcript = ""
            # Update transcript instance
            transcript_instance.categoryName = categoryName
            transcript_instance.video_name = video_file.name
            transcript_instance.transcription = transcript
            transcript_instance.video_url = video_url
            transcript_instance.save()

            serializer = TranscriptSerializer(transcript_instance)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error updating video: {e}")
            return Response({"error": "An error occurred while updating the video"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        finally:
            delete_file(video_path)
