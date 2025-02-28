from rest_framework import serializers
from .models import Transcript

class TranscriptSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="pk")
    class Meta:
        model = Transcript
        fields = ['id','categoryName', 'transcription','video_url']
