import logging
import subprocess
import numpy as np
import torch
import whisper
import os
from multiprocessing import cpu_count, Pool
from functools import partial

# Set up logging
logger = logging.getLogger(__name__)

# Paths for FFmpeg/FFprobe
FFMPEG_PATH = "ffmpeg"
FFPROBE_PATH = "ffprobe"

# Determine device (GPU if available, else CPU)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Whisper model once (avoid reloading in subprocesses)
model = whisper.load_model("base").to(device)

def convert_video_to_text(video_path, chunk_length=30):
    """
    Processes the video in smaller chunks, transcribes it,
    and deletes the video file after processing.
    """
    total_duration = get_video_duration(video_path)
    if total_duration is None:
        logger.error("Failed to get video duration.")
        return "Transcription Failed"

    chunk_starts = list(range(0, total_duration, chunk_length))
    num_processes = min(cpu_count(), len(chunk_starts), 2)  

    try:
        with Pool(processes=num_processes) as pool:
            process_func = partial(process_chunk, video_path=video_path, chunk_length=chunk_length)
            results = pool.map(process_func, chunk_starts)

        transcript = " ".join([r for r in results if isinstance(r, str)]).strip()
        return transcript if transcript else "Transcription Failed"

    except Exception as e:
        logger.error(f"Error during transcription: {e}")
        return "Transcription Failed"

def process_chunk(start_time, video_path, chunk_length):
    """
    Extracts a chunk of video and transcribes it.
    """
    command = [
        FFMPEG_PATH, "-i", video_path,
        "-vn", "-sn", "-dn",  
        "-f", "wav", "-acodec", "pcm_s16le",
        "-ar", "16000", "-ac", "1",
        "-t", str(chunk_length), "-ss", str(start_time),
        "-threads", "2", "-preset", "ultrafast",
        "-nostdin", "-hide_banner", "-loglevel", "error",
        "pipe:1"
    ]

    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        audio_data, _ = process.communicate()
        if not audio_data:
            logger.warning(f"No audio extracted from {start_time}s to {start_time+chunk_length}s.")
            return ""

        # Convert raw audio bytes to a NumPy array
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        # Transcribe using Whisper model
        result = model.transcribe(audio_np)
        return result.get("text", "")

    except Exception as e:
        logger.error(f"Error processing chunk {start_time}s: {e}")
        return ""

def get_video_duration(video_path):
    """
    Retrieves the duration of the video (in seconds) using FFprobe.
    """
    command = [
        FFPROBE_PATH, "-i", video_path,
        "-show_entries", "format=duration",
        "-v", "quiet", "-of", "csv=p=0"
    ]
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        duration_str = result.stdout.strip()
        return int(float(duration_str)) if duration_str else None
    except Exception as e:
        logger.error(f"Error getting video duration: {e}")
        return None
