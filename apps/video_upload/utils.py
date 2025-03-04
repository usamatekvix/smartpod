import os
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

import os
from django.conf import settings

def save_uploaded_file(uploaded_file, folder):
    save_dir = os.path.join(settings.MEDIA_ROOT, folder)
    os.makedirs(save_dir, exist_ok=True)  # Ensure directory exists

    save_path = os.path.join(save_dir, uploaded_file.name)
    print(f"Saving file to: {save_path}")

    with open(save_path, "wb+") as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)

    print("File saved successfully!")
    return save_path


def delete_file(file_path):
    """Deletes a single file safely."""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Deleted: {file_path}")
        else:
            logger.warning(f"File not found: {file_path}")
    except Exception as e:
        logger.error(f"Error deleting {file_path}: {e}")
