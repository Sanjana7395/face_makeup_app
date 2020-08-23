import React, {Component} from "react";
import history from '../history';
import "./home.css";

class Home extends Component{
    render() {
        return(
            <div class="container-fluid">
                <div class="page-header">
                    <h1 class="appname">fACES</h1>
                </div>
                <div class="row">
                    <div class="col">
                        <h5 class="subheading">Play with your face</h5>
                        <p>Upload an image and make desired changes.</p>
                        <p> Try it yourself !</p>
                        <button type="button" class="btn btn-outline-light getstarted" onClick={() => history.push('/Upload')}>
                            Get Started
                        </button>
                    </div>
                    <div class="col">
                        //TODO
                    </div>
                </div>      
            </div>
        );
    }
}

export default Home;