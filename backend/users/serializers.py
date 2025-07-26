from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Nieprawidłowy email lub hasło")
        
        # generujemy tokeny
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return {
            'refresh': str(refresh),
            'access': str(access),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
            }
        }
    
        data['user'] = user
        return data