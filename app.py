"""
AI Background Remover - Flask Backend
A web application for removing backgrounds from images using AI (rembg library).
"""

import os
import uuid
from datetime import datetime, timedelta
from pathlib import Path

import rembg
from flask import Flask, abort, jsonify, render_template, request, send_file
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # max file size = 10mb
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def generate_unique_filename(original_filename):
    ext = Path(original_filename).suffix.lower()
    unique_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"{timestamp}_{unique_id}{ext}"

def cleanup_old_files(folder, max_age_hours=24):
    try:
        now = datetime.now()
        cutoff = now - timedelta(hours=max_age_hours)
        for filename in os.listdir(folder):
            filepath = os.path.join(folder, filename)
            if os.path.isfile(filepath):
                file_time = datetime.fromtimestamp(os.path.getmtime(filepath))
                if file_time < cutoff:
                    try:
                        os.remove(filepath)
                        print(f"Cleaned up old file: {filename}")
                    except Exception as e:
                        print(f"Error removing file {filename}: {e}")
    except Exception as e:
        print(f"Error during cleanup: {e}")

@app.route('/')
def index():
    cleanup_old_files(app.config['UPLOAD_FOLDER'])
    cleanup_old_files(app.config['OUTPUT_FOLDER'])
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file provided'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400
    if not allowed_file(file.filename):
        return jsonify({
            'success': False,
            'error': 'Invalid file type. Allowed types: PNG, JPG, JPEG, WEBP'
        }), 400
    try:
        filename = generate_unique_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        file_size = os.path.getsize(filepath)
        return jsonify({
            'success': True,
            'filename': filename,
            'size': file_size,
            'message': 'File uploaded successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error uploading file: {str(e)}'
        }), 500

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    data = request.get_json()
    if not data or 'filename' not in data:
        return jsonify({'success': False, 'error': 'No filename provided'}), 400
    input_filename = secure_filename( data['filename'])
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
    if not os.path.exists(input_path):
        return jsonify({'success': False, 'error': 'File not found'}), 404
    try:
        input_image = Image.open(input_path)
        output_image = rembg.remove(input_image)
        output_filename = generate_unique_filename(input_filename).rsplit('.', 1)[0] + '.png'
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        output_image.save(output_path, 'PNG')
        output_size = os.path.getsize(output_path)
        width, height = output_image.size
        return jsonify({
            'success': True,
            'output_filename': output_filename,
            'size': output_size,
            'width': width,
            'height': height,
            'message': 'Background removed successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error processing image: {str(e)}'
        }), 500

@app.route('/download/<filename>')
def download_file(filename):
    safe_filename = secure_filename(filename)
    filepath = os.path.join(app.config['OUTPUT_FOLDER'], safe_filename)
    if not os.path.exists(filepath):
        abort(404)
    return send_file(
        filepath,
        mimetype='image/png',
        as_attachment=True,
        download_name=f'removed_bg_{safe_filename}'
    )

@app.route('/preview/<filename>')
def preview_file(filename):
    safe_filename = secure_filename(filename)
    filepath = os.path.join(app.config['OUTPUT_FOLDER'], safe_filename)
    if not os.path.exists(filepath):
        abort(404)
    return send_file(filepath, mimetype='image/png')

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error."""
    return jsonify({
        'success': False,
        'error': 'File too large. Maximum size is 10MB.'
    }), 413

@app.errorhandler(404)
def not_found(error):
    """Handle not found error."""
    return jsonify({
        'success': False,
        'error': 'Resource not found.'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server error."""
    return jsonify({
        'success': False,
        'error': 'Internal server error.'
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
