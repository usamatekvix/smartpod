from django.db import models

from django.db import models

class AudioFile(models.Model):
    audio = models.FileField(upload_to="audios/")
    categoryName = models.CharField(max_length=225,null=False,blank=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audio: {self.audio.name}"

