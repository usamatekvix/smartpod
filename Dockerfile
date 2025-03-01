# Use official Python image
FROM python:3.11

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Set work directory
WORKDIR /smartpod

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Run migrations and start Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
