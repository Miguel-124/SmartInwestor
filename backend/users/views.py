from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from .serializers import RegisterSerializer, LoginSerializer


class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("id_token")
        if not token:
            return Response({"error": "Brak tokenu Google"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Weryfikacja tokenu Google
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )
            email = idinfo["email"]
            name = idinfo.get("name", "")
            picture = idinfo.get("picture", "")
            sub = idinfo["sub"]

            user, created = CustomUser.objects.get_or_create(email=email)
            if created:
                user.username = email
                user.google_id = sub
                user.avatar_url = picture
                user.set_unusable_password()
                user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                    "avatar_url": user.avatar_url,
                }
            })

        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "username": user.username,
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)