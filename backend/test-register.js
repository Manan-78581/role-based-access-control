const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/register', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        
        console.log('Registration successful:', response.data);
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
    }
}

testRegister();