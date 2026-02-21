# backend/users/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class LoginAPITestCase(TestCase):
    """Test błędnego logowania – system nie wydaje tokenu JWT przy niepoprawnych danych."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse('login')
        User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='correctpass123',
        )

    def test_login_fails_with_wrong_password(self):
        """Weryfikacja, że nieprawidłowe hasło skutkuje odrzuceniem (400) i brakiem tokenu."""
        response = self.client.post(self.url, {
            'email': 'test@example.com',
            'password': 'wrongpassword',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('access', response.data)
