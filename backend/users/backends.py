from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    """
    Uwierzytelnianie po polu email.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        email = kwargs.get('email') or username
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None