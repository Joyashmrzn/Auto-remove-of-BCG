import os
import uuid
import requests
from django.conf import settings
from PIL import Image,ImageEnhance,ImageFilter,ImageDraw
import io
import cv2
import numpy as np
import cloudinary.uploader

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
    img = img.resize((600,600),Image.LANCZOS)
    output = io.BytesIO()
    img.save(output, format="PNG")

    return output.getvalue()


def save_final(image_bytes):
    filename = f"{uuid.uuid4()}.png"
    path = os.path.join(settings.MEDIA_ROOT, filename)

    with open(path, "wb") as f:
        f.write(image_bytes)

    return settings.MEDIA_URL + filename




def add_background_color(image_bytes, color = (255,255,255)):
    if isinstance(color, str):
        color = tuple(int(x.strip())for x in color.split(","))
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    background = Image.new("RGBA", img.size, color + (255,))

    alpha =  img.split()[-1]
    background.paste(img, mask=alpha)

    final = background.convert("RGB")
    output = io.BytesIO()
    final.save(output, format="PNG")
    return output.getvalue()

def create_print_layout(image_bytes, copies):
    passport = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    A4_WIDTH, A4_HEIGHT = 2480, 3508
    canvas = Image.new("RGB", (A4_WIDTH, A4_HEIGHT),(255,255,255))

    PHOTO_W, PHOTO_H =600, 600
    MARGIN = 100

    cols = (A4_WIDTH + MARGIN) // (PHOTO_W + MARGIN)
    rows = (A4_HEIGHT + MARGIN) // (PHOTO_H + MARGIN)

    total_grid_w = cols * PHOTO_W + (cols - 1) * MARGIN
    total_grid_h = rows * PHOTO_H + (rows - 1) * MARGIN
    start_x = (A4_WIDTH - total_grid_w) // 2
    start_y = (A4_HEIGHT - total_grid_h) // 2

    draw = ImageDraw.Draw(canvas)

    count = 0
    for row in range(rows):
        for col in range(cols):
            if count >= copies:
                break
            x = start_x + col * (PHOTO_W + MARGIN)
            y = start_y + row * (PHOTO_H + MARGIN)
            draw_dashed_border(draw, x, y, PHOTO_W, PHOTO_H)
            canvas.paste(passport, (x,y))
            count += 1


    output = io.BytesIO()
    canvas.save(output, format="PNG", dpi = (300,300))
    return output.getvalue()

def save_final(image_bytes, prefix="passport"):
    # Upload to Cloudinary instead of local disk
    result = cloudinary.uploader.upload(
        image_bytes,
        folder="passport_photos",
        public_id=f"{prefix}_{uuid.uuid4()}",
        resource_type="image"
    )
    return result["secure_url"] 

def enchance_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")  # ← change RGB to RGBA

   
    r, g, b, a = img.split()
    rgb_img = Image.merge("RGB", (r, g, b))

    rgb_img = ImageEnhance.Sharpness(rgb_img).enhance(3.0)
    rgb_img = ImageEnhance.Contrast(rgb_img).enhance(1.3)
    rgb_img = ImageEnhance.Brightness(rgb_img).enhance(1.1)

    
    r, g, b = rgb_img.split()
    final = Image.merge("RGBA", (r, g, b, a))  # ← restore transparency

    output = io.BytesIO()
    final.save(output, format="PNG")
    return output.getvalue()

def smart_crop(image_bytes):
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_UNCHANGED)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    haarcascade_path = os.path.join(cv2.__path__[0], 'data', 'haarcascade_frontalface_default.xml')
    face_cascade = cv2.CascadeClassifier(haarcascade_path)

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    if len(faces) == 0:
        return image_bytes

    x, y, w, h = faces[0]

    padding_top    = int(h * 1.5)
    padding_bottom = int(h * 1.8)
    padding_sides  = int(w * 0.8)

    x1 = max(0, x - padding_sides)
    y1 = max(0, y - padding_top)
    x2 = min(img.shape[1], x + w + padding_sides)
    y2 = min(img.shape[0], y + h + padding_bottom)

    cropped = img[y1:y2, x1:x2]

    _, buffer = cv2.imencode('.png', cropped)
    return buffer.tobytes()

def process_pipeline(file, bg_color = (255,255,255), copies = 8):
    temp_path = save_temp(file)

    no_bg = remove_background(temp_path)
    cropped = smart_crop(no_bg)
    resized = resize_passport(cropped)
    enhance = enchance_image(resized)
    colored = add_background_color(enhance, color=bg_color)

    single_url = save_final(colored, prefix="single")

    print_bytes = create_print_layout(colored, copies = copies)
    print_url = save_final(print_bytes, prefix="print")

    

    return{
        "single_photo_url" : single_url,
        "print_layout_url" : print_url,
    }

def draw_dashed_border(draw, x, y, w, h, color=(150,150,150), dash=10):
    # Top line
    for i in range(x, x + w, dash * 2):
        draw.line([(i, y), (min(i + dash, x + w), y)], fill=color, width=1)
    # Bottom line
    for i in range(x, x + w, dash * 2):
        draw.line([(i, y + h), (min(i + dash, x + w), y + h)], fill=color, width=1)
    # Left line
    for i in range(y, y + h, dash * 2):
        draw.line([(x, i), (x, min(i + dash, y + h))], fill=color, width=1)
    # Right line
    for i in range(y, y + h, dash * 2):
        draw.line([(x + w, i), (x + w, min(i + dash, y + h))], fill=color, width=1)