# Face Makup Web application - Backend

This folder contains the backend of the web application implemented using NodeJS and tensorflow.js.
For more on tensorflow.js refer [https://www.tensorflow.org/js/tutorials](https://www.tensorflow.org/js/tutorials).


Setup procedure
----------------
1. In the command prompt move into the face_backend folder in this project.

2. Install packages  
   In order to reproduce the code install the  npm packages 
   
        npm install

3. Add your model in helpers/tfjs_model.
    1. In the nueral network project, where the model is trained and saved or in an isolated python environment(created using pipenv or
    virtualenv) install the convertor by running the following command.
            
            pip install tensorflowjs

    2. Convert the existing tensorflow model to tensorflow.js web format.

            tensorflowjs_converter /source/saved_model/path /destination/face_ackend/helpers/tfjs_model

    For further details on importing a tensorflow GraphDef model to a tensorflow.js model click 
    [here](https://www.tensorflow.org/js/tutorials/conversion/import_saved_model).

    [OR]

    Download the semantic segmentation tensorflow.js web model from [here]
    (https://drive.google.com/drive/folders/1NidAqPT3aVBm54_KRTcbZBcvls98q18L?usp=sharing)

4. Run the project in development mode.
      
        nodemon index.js

    With nodemon the project will reload if you make edits.
      