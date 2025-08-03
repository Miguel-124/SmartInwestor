# portfolio/serializers.py
from rest_framework import serializers
from .models import Portfolio, Position

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['id', 'symbol', 'quantity', 'cost_basis']

class PortfolioSerializer(serializers.ModelSerializer):
    positions = PositionSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ['id', 'name', 'created_at', 'positions']