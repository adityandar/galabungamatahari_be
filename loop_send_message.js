const axios = require('axios');

// URL and Bearer Token
const url = 'http://localhost:3000/messages';
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiZHVtbXlAZW1haWwuY29tIiwibmFtZSI6ImR1bW15IiwiaWF0IjoxNzMxMDc2MjQ3LCJleHAiOjE3MzExMTk0NDd9.S0ompcnj8O15P_EzZz_vCx6itdHgcfyIQeqFTFgVTEg',
  'Content-Type': 'application/json'
};

// Function to send POST request
async function sendPostRequest(i) {
  // Prepare the body with dynamic content based on index
  const body = {
    title: `Missing you${i}`,
    to: `Someone that I loved${i}`,
    message: `Wish u were here${i}`
  };

  try {
    // Send the POST request
    const response = await axios.post(url, body, { headers });
    console.log(`Request ${i} - Status Code: ${response.status}, Response: ${response.data}`);
  } catch (error) {
    console.error(`Request ${i} failed: ${error.message}`);
  }
}

// Loop to send POST requests 100 times
(async () => {
  for (let i = 1; i <= 100; i++) {
    await sendPostRequest(i);
  }
})();

