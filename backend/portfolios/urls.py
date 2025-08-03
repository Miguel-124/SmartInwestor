# portfolio/urls.py
from rest_framework.routers import DefaultRouter
from .views import PortfolioViewSet, PositionViewSet

router = DefaultRouter()
# GET, POST, PUT, DELETE /api/portfolios/
router.register('portfolios', PortfolioViewSet, basename='portfolio')
# GET, POST, PUT, DELETE /api/portfolios/{id}/positions/
router.register('portfolios/(?P<portfolio_pk>[^/.]+)/positions', PositionViewSet, basename='portfolio-positions')

urlpatterns = router.urls