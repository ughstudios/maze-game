from django.shortcuts import render
from django.http import HttpResponse
from django.core.handlers.wsgi import WSGIRequest


def index(request: WSGIRequest) -> HttpResponse:
    return render(request, 'index.html')
