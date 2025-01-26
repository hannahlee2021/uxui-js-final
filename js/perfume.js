
// Global variable to store the API key
let apiKey;

// Fetch the API key when the page loads
async function getApiKey() {
    try {
        const response = await fetch('http://localhost:3000/api-key');
        const data = await response.json();
        apiKey = data.apiKey;
        console.log('API key loaded successfully');
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

// Call this when the page loads
getApiKey();

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

//determines what happens when the form id element is pressed
document.getElementById('form').addEventListener('submit', async function(e) {

	// prevent auto submission
	e.preventDefault();
    
    // Check if API key is loaded
    if (!apiKey) {
        console.log('API key not loaded yet, fetching...');
        await getApiKey();
        if (!apiKey) {
            alert('Could not load API key. Please try again.');
            return;
        }
    }

    //defines variable to store the loader class content (loading animation)
    const loading = document.querySelector(".loader");

    //displays the loading class content when the form id element is pressed
    loading.style.display="block";

    //defines variable storing the content of text written by user in the prompt id element
    const prompts2 = document.getElementById("prompt").value;

//function for calling api
async function start(){
    try {
  
 
    

    //defining variable to store json object to set up usage of openai api
    let json =  JSON.stringify({
      //determining model to be used
        model: "gpt-3.5-turbo",

        //determining what kind of responses openai should provide based on user input
        messages: [
          {
            "role": "system",
            "content": "you are a helpful perfume expert, able to match any description to an existent perfume. Make letters lowercase and follow this format: perfume name - brand."
          },
          
          //takes the text from prompt2 variable (prompt id element) and injects it as the content to be used by openai 
          {
            "role": "user",
            "content": `${prompts2}`
          },

        ]
    });

    //repeat process twice to render 3 separate results with different criteria so that they can be manipulated into the DOM individually

    let json2 =  JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
        
          {
            "role": "system",
            "content": "you are a perfume expert, able to match any description to the notes of the previously recommended perfume. make letters lowercase and this format: top: jasmine | heart: rose | base: sandalwood. "
          },
          {
            "role": "user",
            "content": `give me information about the perfume notes based on my description: ${prompts2}`
          }
        ]
    });

    let json3 =  JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
        
          {
            "role": "system",
            "content": "you are a narrative expert, able to construct a 10 word story revolving around the recommended perfume. make letters lowercase and do not include quotation marks."
          },
          {
            "role": "user",
            "content": `${prompts2}`
          }
        ]
    });

    //storing url of openai api that is asking the chat completions portion for a specific url
    const url = 'https://api.openai.com/v1/chat/completions';

    //creating fetch request to the url
    const response = await fetch(url, {

      //using post request to send data to server
        method: 'POST',

        //the generated data is then stored into the json variable defined earlier, and authorization token is given via apiKey variable
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },

        //takes the value of the json variable and tells fetch function to include it in the body of the post request
        body: json,
    })

    //same process is done three times in order once again separate into 3 different results (correlates to the 3 different json variables)
    const response2 = await fetch(url, {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: json2,
  
    })

    const response3 = await fetch(url, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: json3,
    })
    

    //initialze variables to hold the data retrieved from api for each request and then converts into json object
    const data = await response.json();
    const data2 = await response2.json();
    const data3 = await response3.json();

    //initialize variables to store the openai generated responses 
    const lists = data.choices[0].message.content;
    const list2 = data2.choices[0].message.content;
    const list3 = data3.choices[0].message.content;

    //injects the list variables into the DOM
    document.getElementById("description").innerHTML = `${prompts2}`;
    document.getElementById("name").innerHTML = `${lists} `;
    document.getElementById("notes").innerHTML = `${list2}`;
    document.getElementById("narrative").innerHTML = `${list3}`;

    //hiding the loading animation when results have loaded onto page
    loading.style.display='none';

    //testing for errors
    } catch(error) {
        console.error('Error:', error);
        loading.style.display='none';
        alert('An error occurred. Please try again.');
    }

console.log(lists)

console.log("hi");
   
}

//calling the function storing api call
start();
});