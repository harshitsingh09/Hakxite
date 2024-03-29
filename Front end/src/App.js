import React, { Component } from 'react';
import axios from 'axios';
import noImage from './noImage.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: false,
      translate: false,
      scale: false,
      opacity: false,
      processedImageUrl: ''
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  changeHandler(state) {
    this.setState(state);
  }


  
  handleImageChange(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });

      // Make a POST request to backend to process the image
      let formData = new FormData();
      formData.append('image', file);
      axios.post('/process_image', formData)
        .then(response => {
          // Handle the response from the backend
          this.setState({
            processedImageUrl: response.data.processed_image
          });
        })
        .catch(error => {
          console.error('Error processing image:', error);
        });
    }
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="overall">
        <div className="image">
          <ImageUpload
            rotate={this.state.rotate}
            translate={this.state.translate}
            scale={this.state.scale}
            opacity={this.state.opacity}
            onImageChange={this.handleImageChange}
            processedImageUrl={this.state.processedImageUrl}
          />
        </div>
        <div className="editing">
          <Application onChange={this.changeHandler} isProcessed={this.state.isProcessed} />
        </div>
      </div>
    )
  }
}

class ImageUpload extends Component {
  render() {
    let imagePreview = null;
    let processedImage = null;

    if (this.props.imagePreviewUrl) {
      imagePreview = <img src={this.props.imagePreviewUrl} alt="Preview" />;
    }

    if (this.props.processedImageUrl) {
      processedImage = <img src={this.props.processedImageUrl} alt="Processed" />;
    }

    return (
      <div>
        <input type="file" onChange={this.props.onImageChange} />
        {imagePreview}
        {processedImage}
      </div>
    );
  }
}

class Application extends Component {
  render() {
    let processedImage = null;
    if (this.props.isProcessed) {
      processedImage = <img src="pdf_logo.png" alt="Processed PDF Logo" />;
    }
  
    let actionButton = this.props.isProcessed ? (
      <button className="resetButton" onClick={this.props.onReset}>
        Reset
      </button>
    ) : (
      <button className="processButton" onClick={this.props.onProcess}>
        Process this!
      </button>
    );
  
    return (
      <div className="edit">
        {processedImage}
        <div>
          {actionButton}
        </div>
      </div>
    );
  }
}

export default App;
