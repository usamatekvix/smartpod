from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.conf import settings
import os

from .processing import convert_video_to_text

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

        return Response({
            "message": "Video processed successfully",
            "category": category,
            "video_path": video_path,
            "transcript": transcript
        })
