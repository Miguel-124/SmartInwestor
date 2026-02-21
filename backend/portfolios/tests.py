# backend/portfolios/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class PortfolioAPITestCase(TestCase):
    """
    Zestaw testów weryfikujący poprawność działania zabezpieczeń Endpointów portfeli.
    Testy są uruchamiane w wyizolowanej, tymczasowej bazie danych.
    """
    def setUp(self):
        self.client = APIClient()
        self.test_user = User.objects.create_user(
            username='test@example.com',
            email='test@example.com',
            password='testpass123',
        )
        self.url = reverse('portfolio-list')

    def test_access_denied_for_unauthenticated_user(self):
        """Weryfikacja, czy system odrzuca zapytania bez poprawnego tokenu (401 Unauthorized)."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('detail', response.data)

    def test_access_granted_for_authenticated_user(self):
        """Weryfikacja, czy poprawne uwierzytelnienie pozwala na dostęp do zasobu (200 OK)."""
        self.client.force_authenticate(user=self.test_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
