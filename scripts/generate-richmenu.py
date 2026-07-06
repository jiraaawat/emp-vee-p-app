from PIL import Image, ImageDraw, ImageFont
import os

# Rich menu size: 2500 x 843 (8:3)
WIDTH = 2500
HEIGHT = 843

# Colors from design system
BG = (8, 20, 37)  # #081425
CARD = (15, 32, 49)  # #0f2031
BORDER = (30, 41, 59)  # #1e293b
PRIMARY = (208, 188, 255)  # #d0bcff
SECONDARY = (76, 215, 246)  # #4cd7f6
TERTIARY = (255, 175, 211)  # #ffafd3
TEXT = (216, 227, 251)  # #d8e3fb
TEXT_DIM = (203, 195, 215)  # #cbc3d7

# Button layout: 5 equal buttons in a row
BUTTONS = [
    {"label": "Clock\nIn / Out", "color": SECONDARY},
    {"label": "Request\nOT", "color": PRIMARY},
    {"label": "Expense\nClaim", "color": TERTIARY},
    {"label": "Request\nLeave", "color": SECONDARY},
    {"label": "My\nStatus", "color": PRIMARY},
]

img = Image.new("RGB", (WIDTH, HEIGHT), BG)
draw = ImageDraw.Draw(img)

# Try to load fonts
try:
    font_title = ImageFont.truetype("arial.ttf", 64)
    font_label = ImageFont.truetype("arial.ttf", 56)
    font_badge = ImageFont.truetype("arial.ttf", 32)
except:
    font_title = ImageFont.load_default()
    font_label = ImageFont.load_default()
    font_badge = ImageFont.load_default()

# Draw header
draw.text((70, 50), "EmpVee HR", fill=TEXT, font=font_title)
# Badge
draw.rounded_rectangle([420, 55, 620, 105], radius=10, fill=(37, 50, 72), outline=BORDER, width=2)
draw.text((450, 65), "TAP MENU", fill=SECONDARY, font=font_badge)

# Button dimensions
margin_x = 50
margin_y = 160
button_width = (WIDTH - margin_x * (len(BUTTONS) + 1)) // len(BUTTONS)
button_height = HEIGHT - margin_y - 50

for i, btn in enumerate(BUTTONS):
    x1 = margin_x + i * (button_width + margin_x)
    y1 = margin_y
    x2 = x1 + button_width
    y2 = y1 + button_height

    # Card background
    draw.rounded_rectangle([x1, y1, x2, y2], radius=28, fill=CARD, outline=BORDER, width=2)

    # Accent bar at top
    bar_height = 12
    draw.rounded_rectangle(
        [x1 + 30, y1 + 30, x2 - 30, y1 + 30 + bar_height],
        radius=6,
        fill=btn["color"]
    )

    # Multi-line label centered
    lines = btn["label"].split("\n")
    total_height = len(lines) * 70
    start_y = y1 + (button_height - total_height) // 2 + 10

    for j, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font_label)
        text_w = bbox[2] - bbox[0]
        text_x = x1 + (button_width - text_w) // 2
        text_y = start_y + j * 70
        draw.text((text_x, text_y), line, fill=TEXT, font=font_label)

# Save
output_dir = os.path.join(os.path.dirname(__file__), "..", "public", "richmenu")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "richmenu.png")
img.save(output_path)
print(f"Saved: {output_path}")
