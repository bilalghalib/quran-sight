import cairo
import math
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

# Read the Quran text from a plain text file
logging.info("Loading Quran text...")
with open("./quran.txt", "r", encoding="utf-8") as file:
    quran_text = file.read()
logging.info("Quran text loaded successfully.")

# Set the canvas size and create a Cairo surface and context
width, height = 600, 600
surface = cairo.ImageSurface(cairo.FORMAT_RGB24, width, height)
ctx = cairo.Context(surface)

# Set the background color to white
ctx.set_source_rgb(1, 1, 1)
ctx.paint()

# Set the font and font size
font_size = 2
ctx.select_font_face("Noto Naskh Arabic", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
ctx.set_font_size(font_size)

# Set the starting position and spiral parameters
center_x, center_y = width // 2, height // 2
radius = 10
angle = 0
line_spacing = font_size * 1.5
text_position = 0

# Draw the spiral text
logging.info("Drawing spiral text...")
while text_position < len(quran_text):
    # Calculate the position of the current character
    x = center_x + radius * math.cos(angle)
    y = center_y + radius * math.sin(angle)

    # Draw the character
    ctx.move_to(x, y)
    ctx.show_text(quran_text[text_position])

    # Update the text position and spiral parameters
    text_position += 1
    angle += line_spacing / radius
    radius += 0.05
logging.info("Spiral text drawing completed.")

# Prompt the user to enter a word to highlight
highlight_word = input("Enter a word to highlight: ")

# Find and highlight the occurrences of the word
logging.info("Highlighting occurrences of the word...")
text_position = 0
angle = 0
radius = 10

while text_position < len(quran_text):
    # Calculate the position of the current character
    x = center_x + radius * math.cos(angle)
    y = center_y + radius * math.sin(angle)

    # Check if the current position matches the highlight word
    if quran_text[text_position:].startswith(highlight_word):
        # Set the font weight to bold for highlighting
        ctx.select_font_face("Noto Naskh Arabic", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.move_to(x, y)
        ctx.show_text(quran_text[text_position:text_position + len(highlight_word)])
        ctx.select_font_face("Noto Naskh Arabic", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        text_position += len(highlight_word)
    else:
        ctx.move_to(x, y)
        ctx.show_text(quran_text[text_position])
        text_position += 1

    angle += line_spacing / radius
    radius += 0.05
logging.info("Word highlighting completed.")

# Save the visualization as an image file
logging.info("Saving the visualization as an image file...")
surface.write_to_png("quran_visualization.png")
logging.info("Visualization saved as 'quran_visualization.png'.")
