from flask import Flask, request, jsonify
import cv2
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import base64

app = Flask(__name__)

def process_image(image_data, threshold_value=127):
    try:
        # Convert base64 image data to numpy array
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert the image to grayscale
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply thresholding to isolate bright areas
        ret, thresh_img = cv2.threshold(gray_img, threshold_value, 255, cv2.THRESH_BINARY)

        # Convert the processed image to base64
        _, img_encoded = cv2.imencode('.jpg', thresh_img)
        processed_image_data = base64.b64encode(img_encoded).decode('utf-8')

        # Create a heatmap of the original image
        sns.heatmap(gray_img)
        plt.savefig('heatmap.png')
        with open('heatmap.png', 'rb') as f:
            heatmap_image_data = base64.b64encode(f.read()).decode('utf-8')

        return processed_image_data
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process_image', methods=['POST'])
def process_image_route():
    try:
        # Check if the request contains an image file
        if 'image' not in request.files:
            return jsonify({'error': 'No image found in the request'}), 400

        image_file = request.files['image']
        image_data = image_file.read()

        # Process the image
        processed_image_data = process_image(image_data)

        # Return the processed image data
        return jsonify({'processed_image': processed_image_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
