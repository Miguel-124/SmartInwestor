# users/views.py (fragment)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from .serializers import MeSerializer, SurveySerializer, SetPasswordSerializer, ChangePasswordSerializer, RegisterSerializer, LoginSerializer
from portfolios.models import Portfolio


class GoogleLoginView(APIView):
    throttle_scope = "auth"
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
            Portfolio.ensure_main_for(user)

            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "avatar_url": user.avatar_url,
                    "is_google_linked": user.is_google_linked,
                    "has_completed_survey": user.has_completed_survey,
                    "risk_profile": user.risk_profile,
                }
            })
        except ValueError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    throttle_scope = "auth"
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            Portfolio.ensure_main_for(user)
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "has_completed_survey": user.has_completed_survey,
                    "risk_profile": user.risk_profile,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    throttle_scope = "login"
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        Portfolio.ensure_main_for(serializer.user)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class MeView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MeSerializer

    def get_object(self):
        return self.request.user


class SurveyView(APIView):
    """
    Ankieta (profil ryzyka). POST/PUT – zapis odpowiedzi i ustawienie survey_completed_at.
    GET – zwraca aktualne odpowiedzi (risk_profile).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "risk_profile": user.risk_profile,
            "survey_completed_at": user.survey_completed_at.isoformat() if user.survey_completed_at else None,
            "has_completed_survey": user.has_completed_survey,
        })

    def put(self, request):
        serializer = SurveySerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "risk_profile": request.user.risk_profile,
            "survey_completed_at": request.user.survey_completed_at.isoformat(),
            "has_completed_survey": True,
        })

    def patch(self, request):
        return self.put(request)


class LogoutView(APIView):
    """
    Odbiera refresh token i wrzuca go na blacklistę (wylogowanie).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Brak refresh tokenu."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response({"error": "Nieprawidłowy token."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Wylogowano."}, status=status.HTTP_205_RESET_CONTENT)


class SetPasswordView(generics.UpdateAPIView):
    """
    Ustawienie (pierwszego) hasła – np. po logowaniu z Google.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = SetPasswordSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """
    Zmiana hasła przez zalogowanego usera.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def get_object(self):
        return self.request.user