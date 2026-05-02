# views.py
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .services import process_pipeline
import os

@csrf_exempt
def upload_passport(request):
    if request.method == "POST":
        try:
            file = request.FILES["photo"]

            color_param = request.POST.get("bg_color", "255,255,255")
            bg_color = tuple(int(x) for x in color_param.split(","))

            copies = int(request.POST.get("copies", 8))

            result = process_pipeline(file, bg_color=bg_color, copies=copies)
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({"error":str(e)}, status = 500)
    return JsonResponse({"error":"Only POST method allowed"}, status = 405)

@csrf_exempt
def download_image(request):
    filename = request.GET.get("file")
    if not filename:
        return JsonResponse({"error": "No file specified"}, status=400)

    path = os.path.join(settings.MEDIA_ROOT, filename)
    if not os.path.exists(path):
        return JsonResponse({"error": "File not found"}, status=404)

    return FileResponse(open(path, "rb"), as_attachment=True, filename=filename)