from django.urls import path
from .views import upload_passport

urlpatterns = [
    path('process-image/', upload_passport, name='upload_passport'),
]