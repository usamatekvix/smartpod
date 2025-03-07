from django.db import models
from django.conf import settings  # Import AUTH_USER_MODEL

class Transcript(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Link to User
    categoryName = models.CharField(max_length=255)
    video_name = models.CharField(max_length=255)
    video_url = models.URLField(null=True, blank=True)
    transcription = models.TextField()

    def __str__(self):
        return f"{self.video_name} - {self.user.username}"


