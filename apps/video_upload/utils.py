import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def save_uploaded_file(uploaded_file, folder):

    file_path = os.path.join(settings.MEDIA_ROOT, folder, uploaded_file.name)
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, "wb") as f:
        for chunk in uploaded_file.chunks():
            f.write(chunk)

    logger.info(f"File saved: {file_path}")
    return file_path

def delete_files(file_paths):

    for file_path in file_paths:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Deleted: {file_path}")
