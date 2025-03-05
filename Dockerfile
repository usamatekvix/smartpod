# Use a stable Python version
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Install system dependencies (including git)
RUN apt-get update && apt-get install -y git

# Copy the requirements file first to leverage Docker caching
COPY requirements.txt .

# Upgrade pip, setuptools, and wheel
RUN pip install --upgrade pip setuptools wheel

# Install numpy separately to avoid issues
RUN pip install numpy==1.24.3

# Install Whisper from GitHub (fixes versioning issues)
RUN pip install --no-cache-dir git+https://github.com/openai/whisper.git

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Run the application
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

