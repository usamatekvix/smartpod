from rest_framework import serializers
from .models import Transcript

class TranscriptSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="pk")
    username = serializers.CharField(source='user.username', read_only=True)  

    class Meta:
        model = Transcript
        fields = ['id', 'username', 'categoryName', 'transcription', 'video_url']  

