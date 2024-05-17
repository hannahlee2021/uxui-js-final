
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




const apiKey = "AIzaSyCUX4Ei_mUpECJyBW3OlX_67_RRauzueU8";
const genAI = new GoogleGenerativeAI(apiKey);

//defining what happens in function using file content as parameter
async function fileToGenerativePart(file) {

  //creates promise
    const base64EncodedDataPromise = new Promise((resolve) => {

      //creates fileReader object to read contents of files
      const reader = new FileReader();

      //when reader object is fully loaded, a function is called to split the data from reader.result by the comma, and then resolve promise via the second half of split
      reader.onloadend = () => resolve(reader.result.split(',')[1]);

      //reads file content and then returns data as url
      reader.readAsDataURL(file);
    });

    //returns object with inlineData property and data property is assigned to resolved to base64EncodedDataPromise promise and MIME type is assigned to value of file.type
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }
  
  //function for calling api
  async function run() {

    // For text-and-images input (multimodal), use the gemini-pro-vision model
    //determining what model to be used
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
    //assign to model what kind of response to generate
    const prompt = "Based on the image, recommend a perfume and write a one sentence story.";
  
    //initialize variable storing file input element from HTML
    const fileInputEl = document.querySelector("input[type=file]");

    //within promise, use map function to create array of parts by calling fileToGenerativePart function on each file in input and waiting for completion of all file conversions
    const imageParts = await Promise.all(
      [...fileInputEl.files].map(fileToGenerativePart)
    );
  
    //stores the calling of generateContent method on model object and expects prompt and imageParts input
    const result = await model.generateContent([prompt, ...imageParts]);

    //stores the response property of result of result object
    const response = await result.response;

    //stores the text content of response object
    const text = response.text();
    console.log(text);
  }
  
  run();

  
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