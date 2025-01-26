// // type=module

// ****tried to use the gemini api image analysis but ended up not figuring it out all the way in time *******

//importing the google gemini api so it can be used
import {GoogleGenerativeAI} from "@google/generative-ai";
// import {GoogleGenerativeAI} from "@google/generative-ai";

// // const fs = require("fs");
// // import * as fs from "fs";

//determining what happens when the save id element is clicked
document.getElementById('save').addEventListener('click', function() {

  //using the html2canvas library to capture image of the contents within the result class
    html2canvas(document.querySelectorAll('.results-page'), {
      useCORS: true,
      allowTaint: true,
      //turns the elements of results class into a canvas drawing and determines what happens when results class is turned into canvas
        onrendered: function(canvas) {
          
           //turns the captured canvas drawing into a .png image file and then saves into downloads
          return Canvas2Image.saveAsPNG(canvas);
        }
    });
});

//initialize variables holding id elements
const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("image-view");
const uploadBtn = document.getElementById("upload-btn");

//triggers change event when input value changes (file is selected) via input element and calls uploadImage function
inputFile.addEventListener("change", uploadImage);

//laying out what happens in uploadImage function
function uploadImage() {
    // Add validation to check if a file was selected
    if (!inputFile.files || !inputFile.files[0]) {
        console.error('No file selected');
        return;
    }
    
    //initializes local variable that creates temporary url for selected file and retrieves first selected file from input element
    let imgLink = URL.createObjectURL(inputFile.files[0]);

    //sets background of imageView variable with the content of imgLink url previously generated
    imageView.style.backgroundImage = `url(${imgLink})`;

    //hides upload button when image is imported so it can populate entire area
    uploadBtn.style.display = "none";
}

//adds event listener to dropArea variable and is triggered when item is dragged over the element
dropArea.addEventListener("dragover", function(e){

  //prevents element from automatically accepting item
    e.preventDefault;
})

////adds event listener to dropArea variable and is triggered when item is dropped over the element
dropArea.addEventListener("drop", function(e){

  //prevent dropped item from opening on new page
    e.preventDefault;

    //assign files property of inputFile variable to the dropped file
    inputFile.files = e.dataTransfer.files;
    
    //calls uploadImage function
    uploadImage();
})







//defining what happens in function using file content as parameter
async function fileToGenerativePart(file) {
    console.log("Received file:", file); // Debug log
    
    if (!file || !(file instanceof Blob)) {
        throw new Error('Please select a valid image file');
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            console.log("File successfully read"); // Debug log
            resolve(reader.result.split(',')[1]);
        };
        reader.onerror = () => {
            console.error("Error reading file"); // Debug log
            throw new Error('Error reading file');
        };
        reader.readAsDataURL(file);
    });
}

//function for calling api
async function run() {
    const prompt = "Based on the image, recommend an existing perfume related to the image in one sentence.";
    const prompt2 = "Based on the image, write a one sentence story related to the image.";
    const fileInputEl = document.querySelector("input[type=file]");
    
    
    try {
        if (!fileInputEl.files || !fileInputEl.files[0]) {
            throw new Error('Please select an image first');
        }

        console.log("Selected file:", fileInputEl.files[0]);
        const imagePart = await fileToGenerativePart(fileInputEl.files[0]);
        
        console.log("Attempting to connect to server...");
        
        // Test if server is reachable
        try {
            const testResponse = await fetch('http://localhost:3000/analyze-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    imageData: imagePart,
                })
            });
            const testResponse2 = await fetch('http://localhost:3000/analyze-image', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  prompt: prompt2,
                  imageData: imagePart
              })
          });
            
            console.log("Server response status:", testResponse.status);
            console.log("Server response status:", testResponse2.status);
            const responseData = await testResponse.json();
            const responseData2 = await testResponse2.json();
            console.log("Server response data:", responseData);
            console.log("Server response data:", responseData2);

            document.querySelector('.result-text').innerHTML = responseData;
            const result_2 = document.querySelector('.result-text-2') ;
            result_2.innerHTML = responseData2;
            result_2.style.color = "red";
            // document.querySelector('.result-text-2').innerHTML = responseData2;
            
            
            
            const resultDiv = document.querySelector('.result-text');
            const resultDiv2 = document.querySelector('.result-text-2');

            if (resultDiv) {
                resultDiv.textContent = responseData.text || 'No response text received';
            }
            if (resultDiv2) {
              resultDiv2.textContent = responseData2.text || 'No response text received';
          }
            
        } catch (fetchError) {
            console.error("Network error details:", {
                message: fetchError.message,
                stack: fetchError.stack
            });
            throw new Error(`Failed to connect to server: ${fetchError.message}`);
        }

    } catch (error) {
        console.error("Main error:", error);
        const resultDiv = document.querySelector('.results');
        if (resultDiv) {
            resultDiv.textContent = `Error: ${error.message}`;
        }
    }

    // Display the uploaded image
    const uploadedImg = document.getElementById("uploaded-img");
    if (uploadedImg && fileInputEl.files[0]) {
        const imageUrl = URL.createObjectURL(fileInputEl.files[0]);
        uploadedImg.innerHTML = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 300px;">`;
    }

}

// Clear console to make our logs more visible
console.clear();

// Add event listener for file selection
document.querySelector("input[type=file]").addEventListener("change", () => {
    console.log("File selected - running analysis...");
    run();
});

  
