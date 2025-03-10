import logging
import subprocess
import numpy as np
import torch
import whisper
from multiprocessing import cpu_count, Pool
from functools import partial

from .utils import delete_file


logger = logging.getLogger(__name__)

# Paths for FFmpeg/FFprobe
FFMPEG_PATH = "ffmpeg"
FFPROBE_PATH = "ffprobe"

# Determine device (GPU if available, else CPU)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Whisper model once (avoid reloading in subprocesses)
model = whisper.load_model("tiny").to(device)

# Ensure it's using FP32 on CPU
if device == "cpu":
    model = model.float()


def convert_video_to_text(video_path, chunk_length=30):
    """
    Processes the video in smaller chunks, transcribes it,
    and deletes the video file after processing.
    """
    logger.info(f"Processing video: {video_path}")
    
    total_duration = get_video_duration(video_path)
    if total_duration is None:
        logger.error("Failed to get video duration.")
        return "Transcription Failed"
    
    logger.info(f"Video duration: {total_duration} seconds")

    chunk_starts = list(range(0, total_duration, chunk_length))
    num_processes = min(cpu_count(), len(chunk_starts),2)  

    logger.info(f"Splitting video into {len(chunk_starts)} chunks using {num_processes} parallel processes.")

    try:
        with Pool(processes=num_processes) as pool:
            process_func = partial(process_chunk, video_path=video_path, chunk_length=chunk_length)
            results = pool.map(process_func, chunk_starts)

        transcript = " ".join([r for r in results if isinstance(r, str)]).strip()
        
        if transcript:
            logger.info("Transcription completed successfully.")
            return transcript
        else:
            logger.warning("No text extracted from video.")
            return "Transcription Failed"

    except Exception as e:
        logger.error(f"Error during transcription: {e}")
        return "Transcription Failed"
    finally:
        delete_file(video_path) 

def process_chunk(start_time, video_path, chunk_length):
    """
    Extracts a chunk of video and transcribes it.
    """
    logger.info(f"Processing chunk: {start_time}s to {start_time + chunk_length}s")

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
            logger.warning(f"No audio extracted from {start_time}s to {start_time + chunk_length}s.")
            return ""

        # Convert raw audio bytes to a NumPy array
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        # Transcribe using Whisper model
        result = model.transcribe(audio_np)
        logger.info(f"Chunk {start_time}s transcribed successfully.")

        return result.get("text", "")

    except Exception as e:
        logger.error(f"Error processing chunk {start_time}s: {e}")
        return ""

def get_video_duration(video_path):
    """
    Retrieves the duration of the video (in seconds) using FFprobe.
    """
    logger.info(f"Retrieving duration of video: {video_path}")
    
    command = [
        FFPROBE_PATH, "-i", video_path,
        "-show_entries", "format=duration",
        "-v", "quiet", "-of", "csv=p=0"
    ]
    
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        duration_str = result.stdout.strip()
        
        if duration_str:
            logger.info(f"Video duration retrieved: {duration_str} seconds")
            return int(float(duration_str))
        else:
            logger.error("Failed to retrieve video duration.")
            return None
    except Exception as e:
        logger.error(f"Error getting video duration: {e}")
        return None