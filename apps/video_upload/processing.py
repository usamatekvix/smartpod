import os
import openai
import ffmpeg
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import JsonResponse


def video_processing(video_file):
    # Save video to temporary location
    video_path = default_storage.save(video_file.name, ContentFile(video_file.read()))
    video_full_path = default_storage.path(video_path)

    # Convert video to audio
    audio_path = video_full_path.rsplit(".", 1)[0] + ".mp3"
    ffmpeg.input(video_full_path).output(audio_path).run(overwrite_output=True)

    # Cleanup: Optionally remove video file after conversion
    os.remove(video_full_path)

    # Return success response with audio path
    return JsonResponse({"message": "Video converted to audio successfully", "audio_path": audio_path})

