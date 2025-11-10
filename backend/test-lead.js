const axios = require('axios');

async function testCreateLead() {
    try {
        // First login to get cookies
        const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'admin@test.com',
            password: 'Admin123!'
        }, {
            withCredentials: true
        });

        console.log('Login successful');

        // Extract cookies from login response
        const cookies = loginResponse.headers['set-cookie'];
        
        // Create lead
        const leadData = {
            name: 'Test Lead',
            email: 'test@example.com',
            phone: '123-456-7890',
            company: 'Test Company',
            status: 'new',
            value: 1000
        };

        const createResponse = await axios.post('http://localhost:3001/api/crm/leads', leadData, {
            headers: {
                'Cookie': cookies ? cookies.join('; ') : ''
            }
        });

        console.log('Lead created successfully:', createResponse.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testCreateLead();