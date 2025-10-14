# 🐟 Capable Fish - Photo to SVG Converter

This project converts photos into SVG vector files by tracing contours. Available in both Python (command-line) and JavaScript (web app) versions.

## 🌐 Web Application (GitHub Pages)

The web version is available at: `yourusername[DOT]github[DOT]io/Capable-Fish/`

### Features:
- 📁 Drag & drop or click to upload images
- 🎛️ Real-time threshold and simplification controls
- 👀 Side-by-side preview of original and converted images
- 💾 Direct SVG download
- 📱 Mobile-friendly responsive design
- 🚀 No installation required - runs entirely in the browser

### Files:
- `index.html` — Web application interface
- `photo-to-svg.js` — JavaScript converter implementation

## 🐍 Python Command-Line Tool

### Files

- `photo_to_svg.py` — Main tool. Converts a photo (`.png`, `.jpg`) to SVG.
- `sample_bw_gen.py` — Generates a sample image (`sample_bw.png`) for testing.
- `sample_bw.png` — Created by running `sample_bw_gen.py`.

### Usage

#### 1. Install dependencies

```bash
pip install opencv-python svgwrite numpy
```

#### 2. Create a sample image

```bash
python sample_bw_gen.py
```

This will generate `sample_bw.png` in your directory.

#### 3. Convert a photo to SVG

```bash
python photo_to_svg.py sample_bw.png sample_bw.svg
```

You can use your own black & white photo instead of `sample_bw.png`.

##### Optional: Adjust threshold

```bash
python photo_to_svg.py sample_bw.png sample_bw.svg 100
```

## 🎯 How It Works

1. **Image Processing**: Converts uploaded image to grayscale
2. **Thresholding**: Creates binary (black/white) image based on threshold value
3. **Contour Detection**: Finds object boundaries using edge detection
4. **Vectorization**: Converts contours to SVG path elements
5. **Simplification**: Reduces path complexity while maintaining shape

## 🔧 Parameters

- **Threshold (1-255)**: Controls black/white conversion sensitivity
  - Lower values = more black areas
  - Higher values = more white areas
- **Simplification (0-10)**: Reduces path complexity
  - 0 = No simplification (detailed)
  - Higher values = More simplified paths

## 💡 Tips

- Works best with high-contrast images
- Simple shapes produce cleaner SVG output  
- Adjust threshold based on your image's contrast
- Use simplification to reduce file size and improve performance

## 🚀 GitHub Pages Setup

1. Enable GitHub Pages in repository settings
2. Select "Deploy from a branch" 
3. Choose "main" branch and "/ (root)" folder
4. Your app will be available at `https://yourusername.github.io/repository-name/`

## 📄 License

Open source - feel free to modify and use!