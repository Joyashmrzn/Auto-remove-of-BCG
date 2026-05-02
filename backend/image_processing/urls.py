from django.urls import path
from .views import upload_passport, download_image

urlpatterns = [
    path('process-image/', upload_passport),
    path('download/', download_image),
]