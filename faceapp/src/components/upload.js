import React, { Component } from 'react';
import axios from 'axios';
import "./upload.css";
/*global cv*/

// Main
class Upload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            imagePreviewUrl: null,
            render: null,
            path: null,
            prediction: null,
            image: null
        };    
    } 
    
    // Browse image and display preview image
    handleChange = event => {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }
        reader.readAsDataURL(file)
    }

    // Onclick of upload button initiate Upload and Makeup APIs
    onClickHandler = compName => {
        this.setState({
            render: compName
        });
        const data = new FormData() 
        data.append('file', this.state.file)
        axios.post('http://localhost:8000/api/v1/upload',data, {
        })
        .then(res => {
            this.setState({
                path: res.data.path
            })
            const imgData = {
                path: this.state.path
            }
            axios.post('http://localhost:8000/api/v1/makeup', imgData, {
            })
            .then(imgRes => {
                this.setState({
                    prediction: imgRes.data.prediction,
                    image: imgRes.data.imageArray
                }) 
            })
        })
    }

    // Onclick of upload button changes on right col
    renderSubComponent = () => {
        switch(this.state.render){
            case 'options': return <Options data={this.state}/>
            case null: return <Blank/>
        }
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img className="imgPreview" src={imagePreviewUrl} />);
        } 
        else {
            $imagePreview = (<div className="previewText">
                                Please select an image for preview
                            </div>);
        }
        return (
            <div class="container-fluid">
                <div className="page-header">
                    <h1 className="appname">Makeup Mirror</h1>
                </div>
                <div>
                    <input type="file" class="uploadbutton" onChange={this.handleChange} />
                </div>  
                <div class="row">
                    <div class="col-6">
                        <div>
                            {$imagePreview}
                        </div>
                        <button type="button" class="btn btn-outline-light getstarted" onClick={this.onClickHandler.bind(this, 'options')}>
                            Upload
                        </button> 
                    </div>
                    <div class="col-6">
                        {this.renderSubComponent()}
                    </div>
                </div> 
            </div>
        );
    }
}

class Options extends Component{
    canvasRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            feature: "lip",
            color: "#FF1414"
        };    
    }

    // Store the dropdown option selected
    handleFeatureChange = event => {
        this.setState({
            feature: event.target.value
        });
    }

    // Store the color selected
    handleColorChange = event => {
        this.setState({
            color: event.target.value
        })
    }
    
    // Apply selected changes on the image
    onApplyHandler = event => {
        // Convert hex color code to RGB color code
        const hexToRgb = hex =>
            hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
               .substring(1).match(/.{2}/g)
               .map(x => parseInt(x, 16))

        var applyColor = hexToRgb(this.state.color);
        // Segmented prediction from makeup API
        const data = this.props.data.prediction;
        // Original image from makeup API
        const image = this.props.data.image;
        const bytes = new Uint8ClampedArray(500 * 500 * 4);
        const tar = new Uint8ClampedArray(256 * 256 * 4);
        for (let i = 0; i < 500 * 500; ++i) {
            const j = i * 4;
            const k = i * 3;
            bytes[j + 0] = image[k + 0];
            bytes[j + 1] = image[k + 1];
            bytes[j + 2] = image[k + 2];
            bytes[j + 3] = 255;
        }
        // Changing the color of the selected feature only
        for (let i =0; i < 256 * 256; ++i) {
            const j = i * 4;
            const partId = data[i];
            switch (this.state.feature){
                case "lip": {
                    if(partId == 11 || partId == 12){ 
                        tar[j + 0] = applyColor[0];
                        tar[j + 1] = applyColor[1];
                        tar[j + 2] = applyColor[2];
                        tar[j + 3] = 255;
                    }
                    else{
                        tar[j + 0] = 0;
                        tar[j + 1] = 0;
                        tar[j + 2] = 0;
                        tar[j + 3] = 255;
                    }
                    break;
                }
                case "hair": {
                    if(partId == 13){ 
                        tar[j + 0] = applyColor[0];
                        tar[j + 1] = applyColor[1];
                        tar[j + 2] = applyColor[2];
                        tar[j + 3] = 255;
                    }
                    else{
                        tar[j + 0] = 0;
                        tar[j + 1] = 0;
                        tar[j + 2] = 0;
                        tar[j + 3] = 255;
                    }
                    break;
                }
            }
        }
        let tarInter = new ImageData(tar, 256, 256);
        // Image having the feature with changes color
        let tarCanvas =  cv.matFromImageData(tarInter);
        let tsize = new cv.Size(500, 500);
        // Resize mask to match orriginal image
        cv.resize(tarCanvas, tarCanvas, tsize, 0, 0, cv.INTER_LINEAR)

        // Original image in opencv.js accepted format
        let bytesInter = new ImageData(bytes, 500, 500);
        let bytesCanvas =  cv.matFromImageData(bytesInter);

        let blur = new cv.Mat();
        let ksize = new cv.Size(7, 7);
        // Gaussian blur to sharpen the edges
        cv.GaussianBlur(tarCanvas, blur, ksize, 10);

        // Incorporating changes on the original image
        cv.addWeighted(bytesCanvas, 1, blur, 0.4, 0, bytesCanvas);
        
        blur.delete(); tarCanvas.delete();
        cv.imshow('canvasOutput', bytesCanvas);
        bytesCanvas.delete();
    }

    render(){
        return(
            <div className='selection'>
                <div>
                    <canvas className="size" id="canvasOutput" width="960" height="180" />
                </div>
                <div>
                    <label>
                        Select the feature to change:
                        <select className="featureSelection" value={this.state.feature} onChange={this.handleFeatureChange}>
                            <option value="lip">Lip color</option>
                            <option value="hair">Hair color</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Choose color:
                        <input className="featureSelection" type="color" onChange={this.handleColorChange}/>
                    </label>
                </div>
                <button type="button" class="btn btn-outline-light apply" onClick={this.onApplyHandler}>
                    Apply
                </button>
            </div>
        );
    }
}


class Blank extends Component{
    render(){
        return(
            <div className="blankStyle">
               <h1>STEPS</h1>
               <ul className="steps">
                   <li>Browse an image.</li>
                   <li>Upload it.</li>
                   <li>Select a feature and color to change.</li>
                </ul>
            </div>
        );
    }
}

export default Upload;