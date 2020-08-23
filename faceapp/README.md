# Face Makup Web application - Frontend

This folder contains the front-end web application implemented using ReactJS and opencv.js.

To access opencv.js package include the below link tag in public/index.html file.

    <script async src="https://docs.opencv.org/master/opencv.js" type="text/javascript"></script>

And add `/*global cv*/` in the js file where the package needs to be used.

Setup procedure
----------------
1. In the command prompt move into the faceapp folder in this project.

2. Install packages  
   In order to reproduce the code install the packages. 
        
        npm install

3. Run the project in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
      
        npm start

    The page will reload if you make edits.


### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `New ReactJS project`

        npx create-react-app <name>
        cd <name>
        npm start

For more details refer [this](https://medium.com/@jinalshah999/reactjs-step-by-step-tutorial-series-for-absolute-beginners-part-1-9f727d72d93) 
Medium series 
