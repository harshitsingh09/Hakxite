import React, { Component } from 'react';
import noImage from './noImage.png'
import './App.css';
//import ReactDOM from 'react-dom';

// textInput must be declared here so the ref callback can refer to it
//let textInput = null;

class App extends Component {
  constructor(props) {
    super(props);
    this.state={rotate:false,translate:false,scale:false,opacity:false }
    this.changeHandler = this.changeHandler.bind(this);
  }
  changeHandler(state) {
    this.setState(state);
  }
  render() {
    return (
      <div className="overall">
        <div className="image">
          <ImageUpload rotate={this.state.rotate}
                        translate={this.state.translate}
                        scale={this.state.scale}
                        opacity={this.state.opacity} />
        </div>
        <div className="editing">
          <Application onChange={this.changeHandler}
                        rotate={this.state.rotate}
                        translate={this.state.translate}
                        scale={this.state.scale}
                        opacity={this.state.opacity} />
        </div>
      </div>
    )
  }
}

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '',imagePreviewUrl: ''};
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
    }
    reader.readAsDataURL(file)
  }
  render() {
    let css_transform = ''
    let css_opacity = ''
    if (this.props.rotate){
      css_transform = css_transform+' rotate(45deg)'
    }
    if (this.props.translate){
      css_transform = css_transform+' translate(-40px)'
    }
    if (this.props.scale){
      css_transform = css_transform+' scale(0.5)'
    }
    if (this.props.opacity){
      css_opacity = css_opacity+'0.5'
    }

    let {imagePreviewUrl, file} = this.state;
    let imagePreview = null;
    if (imagePreviewUrl) {
      imagePreview = (<img src={imagePreviewUrl} style={{ transform: css_transform, opacity:css_opacity }} alt="" />);
    } else {
      imagePreview = (<div>
        <img src={noImage} className="image_dis" alt="no image"
        ref={(img) => {this.imageTag = img;}} />
      </div>);
    }
    return (
      
      <div className="previewComponent">
        <div>
          <h1 className="font-bold text-4xl" style={{ color: '#ffffff' }}>NIGHT TIME ANALYZER</h1>
        </div>
      <div className="imgPreview">
        {imagePreview}
      </div>
        <input id="fileInput"
          type="file"
          onChange={(e)=>this.handleImageChange(e)} style={{ display: 'none' }} />
        <button href="#" className="choosebutton">
          <label htmlFor="fileInput">Choose Image</label>
        </button>
      </div>
    )
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    // Define a state variable to track whether an image is processed
    this.state = {
      isProcessed: false
    };
    // Bind the reset function to access 'this'
    this.handleReset = this.handleReset.bind(this);
  }

  // Function to handle reset button click
  handleReset() {
    // Reset the state to indicate no image is processed
    this.setState({ isProcessed: false });
  }

  render() {
    // Display the PDF logo image only when it is processed
    let processedImage = null;
    if (this.state.isProcessed) {
      processedImage = <img src="pdf_logo.png" alt="Processed PDF Logo" />;
    }
  
    // If image is processed, display the reset button, else display the process button
    let actionButton = this.state.isProcessed ? (
      <button className="resetButton" onClick={this.handleReset}>
        Reset
      </button>
    ) : (
      <button className="processButton" onClick={() => this.setState({ isProcessed: true })}>
        Process this!
      </button>
    );
  
    return (
      <div className="edit">
        {/* Display the processed image or null */}
        {processedImage}
        {/* Display the action button */}
        <div>
          {actionButton}
        </div>
      </div>
    );
  }
}  
export default App;
