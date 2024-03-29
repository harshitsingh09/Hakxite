from flask import Flask, request, jsonify
import cv2
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

app = Flask(__name__)

def process_image(image_path, threshold_value=127):
    # Read the image from the provided path
    img = cv2.imread(image_path)
    
    # Convert the image to grayscale
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply thresholding to isolate bright areas
    ret, thresh_img = cv2.threshold(gray_img, threshold_value, 255, cv2.THRESH_BINARY)

    # If you used the grayscale conversion, use 'gray_img' instead of 'img' here
    np_img = np.array(img)

    # Assuming you want to use the green channel
    green_channel = np_img[:,:,1]  # Access green channel (index 1)

    # Pass the green_channel to the heatmap function
    sns.heatmap(green_channel)
    plt.savefig('heatmap.png')  # Save the heatmap to a file

    # Return the path to the processed image
    return 'heatmap.png'

@app.route('/process_image', methods=['POST'])
def process_image_route():
    # Check if the request contains an image file
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in the request'}), 400

    image_file = request.files['image']

    # Save the image to a temporary file
    image_path = 'temp_image.jpg'
    image_file.save(image_path)

    # Process the image
    processed_image_path = process_image(image_path)

    # Return the path to the processed image
    return jsonify({'processed_image': processed_image_path}), 200

if __name__ == '__main__':
    app.run(debug=True)
