FROM python:3.11

ENV APP_HOME=/app
WORKDIR $APP_HOME

LABEL maintainer="osama@tekvix.com"

# Install system dependencies
RUN apt-get update && apt-get install -y git ffmpeg && rm -rf /var/lib/apt/lists/*

# Copy only requirements file first
COPY requirements.txt .

# Install dependencies (cache this step)
RUN pip install --upgrade pip setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the application
COPY . .

# Set entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Run the application
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]

