# users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Konto z tym adresem już istnieje. Zaloguj się lub użyj Google.")
        return value

    def create(self, validated_data):
        # AbstractUser nadal ma 'username' – dajemy go równego emailowi
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
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
        self.user = user

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'has_completed_survey': getattr(user, 'has_completed_survey', False),
                'risk_profile': getattr(user, 'risk_profile', None),
            }
        }
    
class MeSerializer(serializers.ModelSerializer):
    has_completed_survey = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name", "avatar_url",
            "risk_profile", "survey_completed_at", "has_completed_survey",
        ]
        read_only_fields = fields


class SurveySerializer(serializers.Serializer):
    """Ankieta: profil ryzyka (agresywny ±80%, umiarkowany ±20%, bezpieczny ±4%)."""
    risk_profile = serializers.ChoiceField(
        choices=[c[0] for c in User.RISK_CHOICES],
        required=True,
    )

    def save(self, **kwargs):
        from django.utils import timezone
        user = self.context["request"].user
        user.risk_profile = self.validated_data["risk_profile"]
        user.survey_completed_at = timezone.now()
        user.save()
        return user

class SetPasswordSerializer(serializers.Serializer):
    """Ustawia hasło dla kont, które dotąd logowały się np. tylko Google (bez hasła)."""
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError({"current_password": "Nieprawidłowe hasło."})
        validate_password(attrs["new_password"])
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user