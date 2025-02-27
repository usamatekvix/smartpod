from django.db import models

class Transcript(models.Model):
    id = models.AutoField(primary_key=True)
    category = models.CharField(max_length=255)
    video_name = models.CharField(max_length=255)
    transcription = models.TextField()
    

    def __str__(self):
        return self.video_name

