import os
import uuid
import requests
from django.conf import settings
from PIL import Image
import io

def save_temp(file):
    path = os.path.join(settings.MEDIA_ROOT, "temp_" + file.name)

    with open(path, "wb+") as f:
        for chunk in file.chunks():
            f.write(chunk)

    return path



REMOVE_BG_API = 'jKucvVPyfnU5Yy5yApgQKXA3'

def remove_background(image_path):
    response = requests.post(
        "https://api.remove.bg/v1.0/removebg",
        headers= {"X-Api-Key": REMOVE_BG_API},
        files= {"image_file": open(image_path, "rb")},
        data= {"size": "auto"}
    )

    if response.status_code == 200:
        return response.content
    else:
        raise Exception(response.text)
    


def resize_passport(image_bytes):
    img = Image.open(io.BytesIO(image_bytes))
    img = img.resize((600,600))
    output = io.BytesIO()
    img.save(output, format="PNG")

    return output.getvalue()


def save_final(image_bytes):
    filename = f"{uuid.uuid4()}.png"
    path = os.path.join(settings.MEDIA_ROOT, filename)

    with open(path, "wb") as f:
        f.write(image_bytes)

    return settings.MEDIA_URL + filename

def process_pipeline(file):
    from .services import save_temp, remove_background, resize_passport, save_final

    temp_path = save_temp(file)

    no_bg = remove_background(temp_path)

    resized = resize_passport(no_bg)

    url = save_final(resized)

    return url