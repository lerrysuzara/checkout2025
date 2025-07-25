import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for FFL dealer search
app.get('/api/ffl-dealers', async (req, res) => {
  try {
    const { zipcode, businessName, page = 1, per_page = 10 } = req.query;
    
    const bfgApiKey = '968|R3llgpPGIkvkgyqHb60YqcgKCslJslN1hDNkxcTP65fa716b';
    
    const queryParams = new URLSearchParams();
    queryParams.set('per_page', per_page.toString());
    queryParams.set('page', page.toString());

    if (zipcode) {
      queryParams.set('filter[premise_zipcode]', zipcode);
      console.log('Searching FFL dealers by zipcode:', zipcode);
    }

    if (businessName) {
      queryParams.set('filter[business_name]', businessName);
      console.log('Searching FFL dealers by business name:', businessName);
    }

    const bfgUrl = `https://api-sandbox.buyingfreedom.app/api/ffls?${queryParams.toString()}`;
    console.log('Fetching from BFG API:', bfgUrl);

    const response = await fetch(bfgUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bfgApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('BFG API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('BFG API error response:', errorText);
      return res.status(response.status).json({ 
        error: `BFG API request failed: ${response.status}`,
        details: errorText
      });
    }

    const bfgData = await response.json();
    console.log(`Received ${bfgData.data.length} FFL dealers from BFG API`);
    
    res.json(bfgData);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 FFL API Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxy endpoint: http://localhost:${PORT}/api/ffl-dealers`);
}); 