from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services import process_pipeline

@api_view(['POST'])
def process_image(request):
    file = request.FILES['image']

    image_url = process_pipeline(file)

    return Response({
        "success": True,
        "image": image_url
    })