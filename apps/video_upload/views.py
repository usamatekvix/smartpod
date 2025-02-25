import os
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

class VideoUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Allow file uploads

    def post(self, request, *args, **kwargs):
        video_file = request.FILES.get("videoFile")  # Get the uploaded file
        if not video_file:
            return JsonResponse({"error": "No video file provided"}, status=400)

        # Define local file path
        video_path = os.path.join(settings.MEDIA_ROOT, "videos", video_file.name)

        # Ensure directory exists
        os.makedirs(os.path.dirname(video_path), exist_ok=True)

        # Save file locally
        with open(video_path, "wb+") as destination:
            for chunk in video_file.chunks():
                destination.write(chunk)

        return JsonResponse({"message": "Video saved successfully", "video_path": video_path}, status=201)
