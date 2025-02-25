from rest_framework import serializers

from .models import AudioFile


class VideoUploadSerializer(serializers.Serializer):
    class Meta:
        model = AudioFile
        Fields =['audio', 'categoryName']

