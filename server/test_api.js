const axios = require('axios');

async function test() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log('Root check:', response.data);
        
        try {
            const loginResp = await axios.post('http://localhost:5000/api/auth/login', {
                username: 'admin',
                password: 'wrong-password'
            });
        } catch (err) {
            console.log('Login route check (Expected 401, not 404):', err.response?.status);
        }
    } catch (err) {
        console.error('Server check failed:', err.message);
    }
}

test();
