import os
import ffmpeg
import whisper
from django.conf import settings
import os
from openai import OpenAI
from django.conf import settings 


FFMPEG_PATH = r"D:\software_installation\ffmpeg\bin\ffmpeg.exe"
client = OpenAI(api_key=settings.SETTINGS_ENV("OPENAI_API_KEY"))

def convert_video_to_text(video_path):
    # Extract video filename without extension
    video_filename = os.path.basename(video_path)  # Get "video.mp4"
    audio_filename = os.path.splitext(video_filename)[0] + ".mp3"  # Change to "video.mp3"

    # Construct audio path in "media/audio"
    audio_path = os.path.join(settings.MEDIA_ROOT, "audios", audio_filename)

    # Ensure the 'audio' directory exists
    os.makedirs(os.path.dirname(audio_path), exist_ok=True)

    try:
        # Convert video to audio using FFmpeg
        ffmpeg.input(video_path).output(audio_path, format="mp3", acodec="libmp3lame").run(cmd=FFMPEG_PATH, overwrite_output=True)
        print(f"Audio extracted: {audio_path}")

        # Check if audio file was created
        if not os.path.exists(audio_path):
            print(f"Audio file not found: {audio_path}")
            return None
        
        # Transcribe the extracted audio
        transcript = transcribe_audio(audio_path)
        return transcript
    except ffmpeg.Error as e:
        print(f" FFmpeg Error: {e}")
        return None


def transcribe_audio(audio_path):  
    print(f"Transcribing: {audio_path}")  
    try:
        with open(audio_path, "rb") as audio_file:
            result = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
        
        transcript = result.text.strip()
        return transcript

    except Exception as e:
        print(f"transcribe_audio error {e}")
        return None

