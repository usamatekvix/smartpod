from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import get_user_model


User = get_user_model()

class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "password","re_password")

class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_active")
