class PhotoToSVGConverter {
    constructor() {
        this.currentImage = null;
        this.currentImageData = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const thresholdSlider = document.getElementById('threshold');
        const simplificationSlider = document.getElementById('simplification');
        const convertBtn = document.getElementById('convertBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        // File upload handling
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });

        // Slider updates
        thresholdSlider.addEventListener('input', (e) => {
            document.getElementById('thresholdValue').textContent = e.target.value;
        });

        simplificationSlider.addEventListener('input', (e) => {
            document.getElementById('simplificationValue').textContent = e.target.value;
        });

        // Convert button
        convertBtn.addEventListener('click', () => this.convertToSVG());

        // Download button
        downloadBtn.addEventListener('click', () => this.downloadSVG());
    }

    handleFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        this.hideError();
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.displayOriginalImage();
                document.getElementById('convertBtn').disabled = false;
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }

    displayOriginalImage() {
        const canvas = document.getElementById('originalCanvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate display size while maintaining aspect ratio
        const maxSize = 400;
        let { width, height } = this.currentImage;
        
        if (width > height) {
            if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(this.currentImage, 0, 0, width, height);
        
        // Store image data for processing
        this.currentImageData = ctx.getImageData(0, 0, width, height);
    }

    convertToSVG() {
        if (!this.currentImageData) return;

        this.showLoading();
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            try {
                const threshold = parseInt(document.getElementById('threshold').value);
                const simplification = parseInt(document.getElementById('simplification').value);
                
                const svg = this.processImageToSVG(this.currentImageData, threshold, simplification);
                this.displaySVG(svg);
                this.hideLoading();
                document.getElementById('previewArea').style.display = 'grid';
            } catch (error) {
                this.hideLoading();
                this.showError('Error converting image: ' + error.message);
            }
        }, 100);
    }

    processImageToSVG(imageData, threshold, simplification) {
        const { width, height, data } = imageData;
        
        // Convert to grayscale and apply threshold
        const binaryData = new Uint8Array(width * height);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convert to grayscale using luminance formula
            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            const pixelIndex = i / 4;
            
            // Apply threshold
            binaryData[pixelIndex] = gray > threshold ? 255 : 0;
        }
        
        // Find contours using a simplified algorithm
        const contours = this.findContours(binaryData, width, height);
        
        // Convert contours to SVG
        return this.contoursToSVG(contours, width, height, simplification);
    }

    findContours(binaryData, width, height) {
        const visited = new Array(width * height).fill(false);
        const contours = [];
        
        // Simple contour tracing algorithm
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const index = y * width + x;
                
                if (binaryData[index] === 0 && !visited[index]) {
                    // Found a black pixel, trace the contour
                    const contour = this.traceContour(binaryData, width, height, x, y, visited);
                    if (contour.length > 10) { // Filter out very small contours
                        contours.push(contour);
                    }
                }
            }
        }
        
        return contours;
    }

    traceContour(binaryData, width, height, startX, startY, visited) {
        const contour = [];
        const directions = [
            [-1, -1], [0, -1], [1, -1],
            [-1,  0],          [1,  0],
            [-1,  1], [0,  1], [1,  1]
        ];
        
        let x = startX, y = startY;
        const maxPoints = 1000; // Prevent infinite loops
        let pointCount = 0;
        
        do {
            const index = y * width + x;
            if (visited[index] || pointCount > maxPoints) break;
            
            visited[index] = true;
            contour.push({ x, y });
            pointCount++;
            
            // Find next black pixel in the neighborhood
            let found = false;
            for (const [dx, dy] of directions) {
                const nx = x + dx;
                const ny = y + dy;
                const nIndex = ny * width + nx;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height &&
                    binaryData[nIndex] === 0 && !visited[nIndex]) {
                    x = nx;
                    y = ny;
                    found = true;
                    break;
                }
            }
            
            if (!found) break;
            
        } while (pointCount < maxPoints);
        
        return contour;
    }

    contoursToSVG(contours, width, height, simplification) {
        let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
        
        contours.forEach(contour => {
            if (contour.length < 3) return;
            
            // Simplify contour if needed
            const simplifiedContour = simplification > 0 ? 
                this.simplifyContour(contour, simplification) : contour;
            
            if (simplifiedContour.length < 3) return;
            
            let pathData = `M ${simplifiedContour[0].x} ${simplifiedContour[0].y}`;
            
            for (let i = 1; i < simplifiedContour.length; i++) {
                pathData += ` L ${simplifiedContour[i].x} ${simplifiedContour[i].y}`;
            }
            
            pathData += ' Z';
            
            svgContent += `<path d="${pathData}" fill="black" stroke="none"/>`;
        });
        
        svgContent += '</svg>';
        return svgContent;
    }

    simplifyContour(contour, tolerance) {
        if (contour.length <= 2) return contour;
        
        // Douglas-Peucker algorithm for line simplification
        const simplified = [contour[0]];
        
        for (let i = 1; i < contour.length; i++) {
            const current = contour[i];
            const last = simplified[simplified.length - 1];
            
            const distance = Math.sqrt(
                Math.pow(current.x - last.x, 2) + Math.pow(current.y - last.y, 2)
            );
            
            if (distance > tolerance) {
                simplified.push(current);
            }
        }
        
        return simplified;
    }

    displaySVG(svgContent) {
        const container = document.getElementById('svgContainer');
        container.innerHTML = svgContent;
        this.currentSVG = svgContent;
    }

    downloadSVG() {
        if (!this.currentSVG) return;
        
        const blob = new Blob([this.currentSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted-image.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('errorMessage').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loadingMessage').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loadingMessage').style.display = 'none';
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PhotoToSVGConverter();
});