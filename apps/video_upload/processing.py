import os
import ffmpeg
import whisper

from django.conf import settings
import os
from django.conf import settings 
import logging


logger = logging.getLogger(__name__)

FFMPEG_PATH = "ffmpeg"
model = whisper.load_model("base")

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

        ffmpeg.input(video_path).output(
            audio_path, 
            format="wav",         
            acodec="pcm_s16le",   
            ar="16000",           
            ac="1"                
        ).run(cmd=FFMPEG_PATH, overwrite_output=True)

        logging.info(f"Audio extracted: {audio_path}")

        # Check if audio file was created
        if not os.path.exists(audio_path):
            logging.info(f"Audio file not found: {audio_path}")
            return None
        
        # Transcribe the extracted audio
        transcript = transcribe_audio(audio_path)
        return transcript
    except ffmpeg.Error as e:
        logging.error(f" FFmpeg Error: {e}")
        return None


def transcribe_audio(audio_path):
    print(f"Transcribing: {audio_path}")
    try:
        result = model.transcribe(audio_path)
        transcript = result["text"]
        return transcript
    except Exception as e:
        logging.error(f"transcribe_audio error {e}")