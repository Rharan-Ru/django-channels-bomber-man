from django.shortcuts import render
from django.views import View


class RoomView(View):
    def get(self, request):
        return render(request, 'room/room.html')
