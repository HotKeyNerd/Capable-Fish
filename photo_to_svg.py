import cv2
import numpy as np
import svgwrite
import sys
import os

def photo_to_svg(input_image_path, output_svg_path, threshold=128):
    img = cv2.imread(input_image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(f"Error: Could not open image file {input_image_path}")
        sys.exit(1)
    _, thresh = cv2.threshold(img, threshold, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    height, width = img.shape
    dwg = svgwrite.Drawing(output_svg_path, size=(width, height))
    for cnt in contours:
        points = cnt.squeeze().tolist()
        if isinstance(points[0], int):
            continue
        if len(points) < 2:
            continue
        path = "M {} {}".format(points[0][0], points[0][1])
        for x, y in points[1:]:
            path += " L {} {}".format(x, y)
        path += " Z"
        dwg.add(dwg.path(d=path, fill="black", stroke="none"))
    dwg.save()
    print(f"SVG saved to {output_svg_path}")

def main():
    if len(sys.argv) < 3:
        print("Usage: python photo_to_svg.py input_image.jpg output_image.svg [threshold]")
        sys.exit(1)
    input_image_path = sys.argv[1]
    output_svg_path = sys.argv[2]
    threshold = int(sys.argv[3]) if len(sys.argv) > 3 else 128
    photo_to_svg(input_image_path, output_svg_path, threshold)

if __name__ == "__main__":
    main()