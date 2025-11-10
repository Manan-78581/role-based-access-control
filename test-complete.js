const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testHealthCheck() {
    try {
        const response = await axios.get(`${API_BASE}/health`);
        console.log('✅ Health check passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

async function testRegister() {
    try {
        const testUser = {
            username: 'testuser' + Date.now(),
            email: `test${Date.now()}@example.com`,
            password: 'password123'
        };

        const response = await axios.post(`${API_BASE}/auth/register`, testUser);
        console.log('✅ Registration successful:', {
            message: response.data.message,
            userId: response.data.data.user._id,
            username: response.data.data.user.username
        });
        return testUser;
    } catch (error) {
        console.error('❌ Registration failed:', error.response?.data || error.message);
        return null;
    }
}

async function testLogin(credentials) {
    try {
        const response = await axios.post(`${API_BASE}/auth/login`, {
            email: credentials.email,
            password: credentials.password
        }, {
            withCredentials: true
        });
        
        console.log('✅ Login successful:', {
            message: response.data.message,
            userId: response.data.data.user._id,
            role: response.data.data.user.role
        });
        return true;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting RBAC Backend Tests...\n');
    
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log('❌ Server is not running. Please start the backend server first.');
        return;
    }
    
    console.log('\n2. Testing Registration...');
    const testUser = await testRegister();
    if (!testUser) {
        console.log('❌ Registration test failed. Check the logs above.');
        return;
    }
    
    console.log('\n3. Testing Login...');
    const loginOk = await testLogin(testUser);
    if (!loginOk) {
        console.log('❌ Login test failed. Check the logs above.');
        return;
    }
    
    console.log('\n🎉 All tests passed! Registration and login are working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Start the frontend: npm start (in the frontend directory)');
    console.log('2. Open http://localhost:3000 in your browser');
    console.log('3. Try registering a new user through the web interface');
}

runTests();