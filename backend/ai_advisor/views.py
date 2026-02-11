from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .services import run_smart_advisor
from .models import ChatHistory

class ChatAdvisorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query = request.data.get("query")
        if not query:
            return Response({"error": "Brak zapytania"}, status=400)
            
        response_text = run_smart_advisor(request.user, query)
        
        # Zapis do historii w bazie 
        ChatHistory.objects.create(
            user=request.user,
            message_text=query,
            ai_response=response_text
        )
        
        return Response({"response": response_text})