import {GoogleGenerativeAI} from "@google/generative-ai";
const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };


const genAI = new GoogleGenerativeAI('AIzaSyCUX4Ei_mUpECJyBW3OlX_67_RRauzueU8');
//const model = genAI.getGenerativeModel({model: "gemini-1.0-pro-vision-latest", generationConfig})

function fileToGenerativePath(path,mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

async function run() {
    const model = genAI.getGenerativeModel({model: "gemini-pro-vision"});
    const prompt = "";

    const imageParts = [fileToGenerativePath("348s.jpg", "image/png")];

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();
// async function generateContent() {
//     const image = document.getElementById("input-file").value;
//     const imageData = await fs.readFile(image);
//     const imageFormat = imageData.toString('base64');

//     const parts= [
//         {
//             text:""
//         },
//         {
//             inlineData: {
//                 mimeType:"image/jpeg",
//                 data:imageFormat
//             }
//         }
//     ]

//     const data = await model.generateContent({
//         content: [{
//             role: "user",
//             data: parts
//         }]
//     })
//     const result = await data.response;
//     const text = result.text;
//     console.log(text);
// }

