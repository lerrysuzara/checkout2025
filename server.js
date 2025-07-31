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
    console.log('📥 Received request with query parameters:', req.query);
    
    // Handle nested filter object structure
    const zipcode = req.query.filter?.premise_zipcode || req.query['filter[premise_zipcode]'];
    const businessName = req.query.filter?.business_name || req.query['filter[business_name]'];
    const page = req.query.page || 1;
    const per_page = req.query.per_page || 10;
    
    console.log('🔍 Extracted parameters:');
    console.log('   zipcode:', zipcode);
    console.log('   businessName:', businessName);
    console.log('   page:', page);
    console.log('   per_page:', per_page);
    
    const bfgApiKey = '968|R3llgpPGIkvkgyqHb60YqcgKCslJslN1hDNkxcTP65fa716b';
    
    const queryParams = new URLSearchParams();
    queryParams.set('page_size', per_page.toString());
    queryParams.set('page', page.toString());
    queryParams.set('include', 'company');

    if (zipcode) {
      queryParams.set('filter[premise_zipcode]', zipcode);
      console.log('Searching FFL dealers by zipcode:', zipcode);
    }

    if (businessName) {
      queryParams.set('filter[business_name]', businessName);
      console.log('Searching FFL dealers by business name:', businessName);
    }

    const bfgUrl = `https://api-sandbox.buyingfreedom.app/api/ffls?${queryParams.toString()}`;
    console.log('🌐 Making request to BFG API:');
    console.log('   URL:', bfgUrl);
    console.log('   Method: GET');
    console.log('   Headers:', {
      'Authorization': `Bearer ${bfgApiKey.substring(0, 10)}...`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    console.log('   Query Parameters:', Object.fromEntries(queryParams.entries()));

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
    console.log(`📥 Received response from BFG API:`);
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Data count: ${bfgData.data.length} FFL dealers`);
    console.log(`   Response structure:`, {
      hasData: !!bfgData.data,
      dataType: Array.isArray(bfgData.data) ? 'array' : typeof bfgData.data,
      dataLength: bfgData.data?.length || 0,
      hasLinks: !!bfgData.links,
      hasMeta: !!bfgData.meta
    });
    
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