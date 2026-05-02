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

def process_pipeline(file, bg_color = (255,255,255), copies = 8):
    temp_path = save_temp(file)

    no_bg = remove_background(temp_path)
    resized = resize_passport(no_bg)
    colored = add_background_color(resized, color=bg_color)

    single_url = save_final(colored, prefix="single")

    print_bytes = create_print_layout(colored, copies = copies)
    print_url = save_final(print_bytes, prefix="print")

    os.remove(temp_path)

    return{
        "single_photo_url" : single_url,
        "print_layout_url" : print_url,
    }


def add_background_color(image_bytes, color = (255,255,255)):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    background = Image.new("RGBA", img.size, color + (255,))

    alpha =  img.split()[-1]
    background.paste(img, mask=alpha)

    final = background.convert("RGBA")
    output = io.BytesIO()
    final.save(output, format="PNG")
    return output.getvalue()

def create_print_layout(image_bytes, copies):
    passport = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    A4_WIDTH, A4_HEIGHT = 2480, 3508
    canvas = Image.new("RGB", (A4_WIDTH, A4_HEIGHT),(255,255,255))

    PHOTO_W, PHOTO_H =600, 600
    MARGIN = 40

    cols = (A4_WIDTH + MARGIN) // (PHOTO_W + MARGIN)
    rows = (A4_HEIGHT + MARGIN) // (PHOTO_H + MARGIN)

    total_grid_w = cols * PHOTO_W + (cols - 1) * MARGIN
    total_grid_h = rows * PHOTO_H + (rows - 1) * MARGIN
    start_x = (A4_WIDTH - total_grid_w) // 2
    start_y = (A4_HEIGHT - total_grid_h) // 2

    count = 0
    for row in range(rows):
        for col in range(cols):
            if count >= copies:
                break
            x = start_x + col * (PHOTO_W + MARGIN)
            y = start_y + row * (PHOTO_H + MARGIN)
            canvas.paste(passport, (x,y))
            count += 1


    output = io.BytesIO()
    canvas.save(output, format="PNG", dpi = (300,300))
    return output.getvalue()

def save_final(image_bytes, prefix="passport"):
    filename = f"{prefix}_{uuid.uuid4()}.png"
    path = os.path.join(settings.MEDIA_ROOT, filename)
    with open(path, "wb") as f:
        f.write(image_bytes)
    return settings.MEDIA_URL + filename