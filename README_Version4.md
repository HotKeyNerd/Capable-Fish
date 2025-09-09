# Black & White Photo to SVG Converter

This tool converts black and white photos into SVG vector files by tracing contours.

## Files

- `photo_to_svg.py` — Main tool. Converts a photo (`.png`, `.jpg`) to SVG.
- `sample_bw_gen.py` — Generates a sample image (`sample_bw.png`) for testing.
- `sample_bw.png` — Created by running `sample_bw_gen.py`.

## Usage

### 1. Install dependencies

```bash
pip install opencv-python svgwrite numpy
```

### 2. Create a sample image

```bash
python sample_bw_gen.py
```

This will generate `sample_bw.png` in your directory.

### 3. Convert a photo to SVG

```bash
python photo_to_svg.py sample_bw.png sample_bw.svg
```

You can use your own black & white photo instead of `sample_bw.png`.

#### Optional: Adjust threshold

```bash
python photo_to_svg.py sample_bw.png sample_bw.svg 100
```

## Output

- The SVG file will appear as `sample_bw.svg` (or your chosen output name).

## Notes

- Works best with high-contrast, black & white images.
- For more complex images, tweak the `threshold` value.