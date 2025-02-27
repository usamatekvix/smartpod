from django.db import models

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=255)
    video_name = models.CharField(max_length=255)
    transcription = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.video_name

