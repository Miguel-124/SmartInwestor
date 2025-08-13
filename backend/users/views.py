# users/views.py (fragment)
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
            info = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)
            email = info["email"]
            picture = info.get("picture") or ""
            sub = info["sub"]  # Google subject (unikalne ID)

            user = CustomUser.objects.filter(google_id=sub).first()
            if not user:
                user, created = CustomUser.objects.get_or_create(email=email)
                if created:
                    user.set_unusable_password()
                # linkowanie (idempotentnie)
                if not user.google_id:
                    user.google_id = sub
                if picture and not user.avatar_url:
                    user.avatar_url = picture
                user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "avatar_url": user.avatar_url,
                    "is_google_linked": user.is_google_linked,
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
                "user": {"id": user.id, "email": user.email}
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)