# AI Background Remover

A web-based AI Background Remover built with Python, Flask, and the rembg library. Features a pixel/retro game-inspired UI for removing backgrounds from images automatically.

![AI Background Remover](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features

- **AI-Powered Background Removal**: Uses the rembg library with U²-Net model for accurate background removal
- **Drag & Drop Support**: Easily upload images by dragging and dropping
- **Multiple Format Support**: Accepts PNG, JPG, JPEG, and WEBP images
- **Transparent PNG Output**: Processed images are saved as transparent PNG files
- **Pixel/Retro UI**: Clean, user-friendly interface with 8-bit retro game styling
- **Responsive Design**: Works on desktop and mobile devices
- **Fast Processing**: Optimized for quick background removal
- **Secure File Handling**: File validation, size limits, and secure filename handling

## Project Structure

```
ai-background-remover/
├── app.py                 # Flask application with all routes
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── static/
│   ├── css/
│   │   └── style.css     # Pixel-themed CSS styles
│   └── js/
│       └── main.js       # JavaScript for UI interactions
├── templates/
│   └── index.html        # Main HTML template
├── uploads/              # Temporary upload directory
└── outputs/              # Processed images directory
```

## Requirements

- **Python**: 3.8 or higher
- **Operating System**: Windows, macOS, or Linux
- **Disk Space**: ~500MB for dependencies and models
- **Memory**: 4GB RAM recommended (8GB for better performance)

## Installation

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd ai-background-remover
```

### Step 2: Create a Virtual Environment (Recommended)

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

This will install:

- Flask (Web framework)
- rembg (AI background removal)
- Pillow (Image processing)
- onnxruntime (Model runtime)
- pymatting (Alpha matting)
- pooch (Model downloader)

### Step 4: Verify Installation

Check that all packages are installed correctly:

```bash
pip list
```

You should see Flask, rembg, Pillow, and other packages listed.

## Running the Application

### Start the Flask Server

Run the application with:

```bash
python app.py
```

You should see output similar to:

```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://0.0.0.0:5000
```

### Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

The application will load with the pixel-themed interface.

## Usage

1. **Upload an Image**:
   - Click "Browse Files" to select an image
   - Or drag and drop an image onto the upload box

2. **Preview the Image**:
   - The uploaded image will be displayed
   - File details (name, size, type) are shown

3. **Remove Background**:
   - Click the "Remove Background" button
   - Wait for the AI to process the image (usually 2-10 seconds)

4. **Download the Result**:
   - The processed image with transparent background will appear
   - Click "Download PNG" to save the result

5. **Process Another Image**:
   - Click "Upload Another" to start over

## Supported File Types

- **PNG** (.png)
- **JPEG** (.jpg, .jpeg)
- **WebP** (.webp)

## File Size Limit

Maximum file size: **10MB**

## API Endpoints

| Endpoint               | Method | Description                         |
| ---------------------- | ------ | ----------------------------------- |
| `/`                    | GET    | Render homepage                     |
| `/upload`              | POST   | Upload image file                   |
| `/remove-bg`           | POST   | Process image and remove background |
| `/download/<filename>` | GET    | Download processed image            |
| `/preview/<filename>`  | GET    | Preview processed image             |

## Configuration

You can modify the following settings in [`app.py`](app.py:1):

```python
# Maximum file size (default: 10MB)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Allowed file extensions
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}

# Auto-cleanup age (default: 24 hours)
cleanup_old_files(folder, max_age_hours=24)
```

## Troubleshooting

### Issue: "Module not found" error

**Solution**: Make sure you've activated the virtual environment and installed dependencies:

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### Issue: Model download is slow

**Solution**: The first run will download the AI model (~176MB). This is a one-time process. Subsequent runs will use the cached model.

### Issue: "File too large" error

**Solution**: Reduce the image size or compress it before uploading. The maximum size is 10MB.

### Issue: Port 5000 already in use

**Solution**: Change the port in [`app.py`](app.py:1):

```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Use port 5001
```

### Issue: Background removal is slow

**Solution**:

- Use smaller images for faster processing
- Close other applications to free up memory
- Consider using a GPU (requires additional setup)

## Optional Improvements

Here are some features that could be added in the future:

- [ ] Batch image processing
- [ ] Background color replacement
- [ ] Background blur option
- [ ] Before/After comparison slider
- [ ] Dark/Light retro theme toggle
- [ ] Progress percentage indicator
- [ ] GPU acceleration support
- [ ] Multiple AI model options
- [ ] Image quality settings
- [ ] API for programmatic access

## Security Features

- File type validation (MIME type + extension)
- Filename sanitization to prevent path traversal
- Upload size limits
- No arbitrary file execution
- Auto-cleanup of old temporary files

## Performance Tips

1. **Use smaller images**: Images under 2000x2000 pixels process faster
2. **Close unused apps**: Free up memory for better performance
3. **Use SSD storage**: Faster disk I/O improves processing speed
4. **Enable GPU**: For production use, consider GPU acceleration

## License

This project is open source and available under the MIT License.

## Credits

- **rembg**: AI background removal library
- **U²-Net**: Deep learning model for segmentation
- **Flask**: Python web framework
- **Press Start 2P**: Pixel font by CodeMan38

## Support

For issues, questions, or contributions, please refer to the project repository.

---

**Enjoy removing backgrounds with AI! 🎮✨**
