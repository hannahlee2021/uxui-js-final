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
    html2canvas(document.querySelectorAll('.results'), {

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





// const generationConfig = {
//     temperature: 1,
//     topK: 0,
//     topP: 0.95,
//     maxOutputTokens: 8192,
//   };


// const genAI = new GoogleGenerativeAI('AIzaSyCUX4Ei_mUpECJyBW3OlX_67_RRauzueU8');
// //const model = genAI.getGenerativeModel({model: "gemini-1.0-pro-vision-latest", generationConfig})

// // function fileToGenerativePath(path,mimeType) {
// //     return {
// //         inlineData: {
// //             data: Buffer.from(fs.readFileSync(path)).toString("base64"),
// //             mimeType,
// //         },
// //     };
// // }
// function fileToGenerativePath(file, mimeType) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = function(event) {
//             const data = event.target.result.split(',')[1]; // Extract base64 data from the Data URL
//             resolve({
//                 inlineData: {
//                     data: data,
//                     mimeType,
//                 },
//             });
//         };
//         reader.onerror = function(error) {
//             reject(error);
//         };
//         reader.readAsDataURL(file);
//     });
// }

// async function run() {
//     const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});
//     const prompt = "";

//     inputFile.addEventListener("change", async function() {
//         const file = inputFile.files[0];
//         const imageParts = await fileToGenerativePath(file, "image/jpg");
//         console.log(imageParts)
//         const result = await model.generateContent([prompt, imageParts]);
        
//         const response = await result.response;
//         const text = response.text();
//         console.log(text);
//         // Now you can use the imageParts for further processing
//     });
//     //const imageParts = [fileToGenerativePath("348s.jpg", "image/png")];

   
// }

// run();




// const apiKey = "AIzaSyBlBBfDgGg-isn5YvkpEbDpSdhWqjG_9b4";
// const apiKey = process.env.GOOGLE_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

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
}

// Clear console to make our logs more visible
console.clear();

// Add event listener for file selection
document.querySelector("input[type=file]").addEventListener("change", () => {
    console.log("File selected - running analysis...");
    run();
});

  
// const genAI = new GoogleGenerativeAI(apiKey);
// const generationConfig = {
//         temperature: 1,
//         topK: 0,
//         topP: 0.95,
//         maxOutputTokens: 8192,
//       };

// const model = genAI.getGenerativeModel({ model: "gemini-pro-vision", generationConfig });

// async function generateContent() {
//     try {
//         // const prompt = "analyze this image";
//         // const result = await model.generateContent(prompt);
//         // const response = await result.response;
//         // console.log(response)
//         const imagePath = "348s.jpg";
//         const imageData = await fs.readFile(imagePath);
//         const imageBase64 = imageData.toString("base64");

//         const parts = [
//             { text: "describe what is happening in the image"},
//             {
//                 inlineData: {
//                     mimeType:"image/jpg",
//                     data:imageBase64
//                 }
//             },
//         ]

//         const result = await model.generateContent({contents: [{role:"user", parts}]})
//         const response = await result.response;
//         console.log(response)
//         document.querySelectorAll("body").innerHTML = response;
//     } catch(error) {
//         console.error("error", error);
//     }
// }
// generateContent();