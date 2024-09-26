const express = require('express');
const axios = require('axios');
const router = express.Router();
var Amadeus = require('amadeus');
const cors = require("cors");
// Your Amadeus credentials
require('dotenv').config();
router.use(cors());


const CLIENT_ID = process.env.CLIENT_ID_AMADEUS;
const CLIENT_SECRET = process.env.CLIENT_SECRET_AMADEUS;
  
   
router.get('/api', async (req, res) => {
    try {
      // Prepare URL-encoded form data
      const data = new URLSearchParams();
      data.append('grant_type', 'client_credentials');
      data.append('client_id', CLIENT_ID);  // Replace with your actual Client ID
      data.append('client_secret', CLIENT_SECRET);  // Replace with your actual Client Secret
  
      // Make the request to Amadeus API
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',  // Send the request as form data
        },
      });
  
      // Send back the access_token
      res.json({ access_token: response.data.access_token });
    } catch (error) {
      console.error('Error fetching access token:', error.response ? error.response.data : error.message);
      res.status(error.response?.status || 500).json({ error: 'Failed to retrieve access token' });
    }
  });



module.exports = router;
