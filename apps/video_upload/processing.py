import logging
import subprocess
import torch
import whisper
import numpy as np
from multiprocessing import cpu_count
from concurrent.futures import ProcessPoolExecutor

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Paths for FFmpeg/FFprobe
FFMPEG_PATH = r"D:\software_installation\ffmpeg\bin\ffmpeg.exe"
FFPROBE_PATH = r"D:\software_installation\ffmpeg\bin\ffprobe.exe"

# Determine device (GPU if available, else CPU)
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load Whisper model (change to "tiny" for even faster processing)
model = whisper.load_model("base").to(device)


def convert_video_to_text(video_path, chunk_length=300):
    """
    Processes the video in larger chunks, transcribes it, 
    and returns the final transcript.
    """
    total_duration = get_video_duration(video_path)
    if total_duration is None:
        logger.error("Failed to get video duration.")
        return "Transcription Failed"

    chunk_starts = list(range(0, total_duration, chunk_length))
    num_processes = min(cpu_count(), len(chunk_starts))

    try:
        with ProcessPoolExecutor(max_workers=num_processes) as executor:
            results = list(
                executor.map(process_chunk, [(video_path, start, chunk_length) for start in chunk_starts])
            )

        transcript = " ".join([str(r) for r in results if isinstance(r, str)]).strip()

        return transcript if transcript else "Transcription Failed"

    except Exception as e:
        logger.error(f"Error during transcription: {e}")
        return "Transcription Failed"


def process_chunk(args):
    """Extracts a chunk of video in memory and transcribes it."""
    video_path, start_time, chunk_length = args
    num_threads = str(cpu_count())  

    command = [
        FFMPEG_PATH, "-i", video_path,
        "-vn", "-sn", "-dn",
        "-f", "wav", "-acodec", "pcm_s16le",
        "-ar", "16000", "-ac", "1",
        "-t", str(chunk_length), "-ss", str(start_time),
        "-threads", num_threads,
        "pipe:1"
    ]

    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        audio_data, _ = process.communicate()

        if not audio_data:
            return ""

        # Convert raw audio bytes to NumPy array (normalize it)
        audio_np = np.frombuffer(audio_data, dtype=np.int16).astype(np.float32) / 32768.0

        # Convert to PyTorch tensor
        device = "cuda" if torch.cuda.is_available() else "cpu"
        audio_tensor = torch.tensor(audio_np).to(device)

        # Transcribe using Whisper model
        result = model.transcribe(audio_tensor.numpy())  # Ensure correct type
        return str(result.get("text", ""))

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
