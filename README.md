# AI Background Remover

A web-based AI Background Remover built with Python, Flask, and the rembg library. Features a aesthetic/retro inspired UI for removing backgrounds from images automatically.

![AI Background Remover](https://img.shields.io/badge/Python-3.12+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)


## Features

- **AI-Powered Background Removal**: Uses the rembg library with U²-Net model for accurate background removal
- **Drag & Drop Support**: Easily upload images by dragging and dropping
- **Multiple Format Support**: Accepts PNG, JPG, JPEG, and WEBP images
- **Transparent PNG Output**: Processed images are saved as transparent PNG files
- **Aesthetic/Simple UI**: Clean, user-friendly interface with simple aesthetic styling
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
│   │   └── style.css     # retro-themed CSS styles
│   └── js/
│       └── main.js       # JavaScript for UI interactions
├── templates/
│   └── index.html        # Main HTML template
├── uploads/              # Temporary upload directory
└── outputs/              # Processed images directory
```

## Requirements

- **Python**: 3.12 or higher

## Installation (Using UV)

### Step 1: Clone this repo and cd into it

```bash
git clone https://github.com/rickviper/background_remover
cd background_remover
```

### Step 2: Make sure uv is installed on your system

To install uv, follow the documentation at: https://docs.astral.sh/uv/

### Step 3: Run the `app.py` file

```bash
uv run app.py
```

UV will automatically start a virtual envrionment, install dependencies and start the server running on localhost.

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

### Issue: "File too large" error

**Solution**: Reduce the image size or change the maximum file size limit in `app.py`. The maximum size is 10MB.

### Issue: Port 5000 already in use

**Solution**: Change the port in [`app.py`](app.py:1):

```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Use port 5001
```

## Security Features

- File type validation (MIME type + extension)
- Filename sanitization to prevent path traversal
- Upload size limits
- No arbitrary file execution
- Auto-cleanup of old temporary files

## License

This project is open source and available under the MIT License.

## Credits

- **Frontend Colour Scheme**: Inspired from Vencord's site
- **Test Image** : from https://upload.wikimedia.org/wikipedia/en/a/a3/Lordvoldemort.jpg

## Support

For issues, questions, or contributions, please refer to the project repository.

---

**Enjoy removing backgrounds with AI!**
