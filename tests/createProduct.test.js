// Test file for createProduct API endpoint
// Run with: node tests/createProduct.test.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';
const AUTH_URL = 'http://localhost:5000/api/auth/login';

// Test credentials (update with your actual credentials)
const TEST_USER = {
    email: 'admin@gmail.com',
    password: 'admin123'
};

let authToken = '';

// Helper function to login and get token
const login = async () => {
    try {
        const response = await axios.post(AUTH_URL, TEST_USER);
        authToken = response.data.token;
        console.log('✅ Login successful');
        return authToken;
    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
        throw error;
    }
};

// Test 1: Create product with minimal payload
const testMinimalPayload = async () => {
    console.log('\n📝 Test 1: Minimal Payload');
    try {
        const payload = {
            title: 'Guard Reporting Project',
            description: 'Comprehensive reporting system for guard management with real-time analytics.'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Failed:', error.response?.data || error.message);
    }
};

// Test 2: Create product with permission
const testWithPermission = async () => {
    console.log('\n📝 Test 2: With Permission Field');
    try {
        const payload = {
            title: 'Guard Analytics Dashboard',
            subtitle: 'Real-time insights and metrics',
            description: 'Advanced analytics dashboard for monitoring guard activities and performance metrics.',
            permission: 'reports.read'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Failed:', error.response?.data || error.message);
    }
};

// Test 3: Create product with all fields
const testCompletePayload = async () => {
    console.log('\n📝 Test 3: Complete Payload');
    try {
        const payload = {
            title: 'Guard Scheduling System',
            subtitle: 'Automated shift management',
            description: 'Complete scheduling system with automated shift assignments, conflict detection, and notifications.',
            permission: 'schedules.read',
            image: 'https://example.com/images/scheduling.png',
            price: 149.99,
            isActive: true
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('✅ Success:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Failed:', error.response?.data || error.message);
    }
};

// Test 4: Missing title (should fail)
const testMissingTitle = async () => {
    console.log('\n📝 Test 4: Missing Title (Expected to Fail)');
    try {
        const payload = {
            description: 'This should fail because title is missing.'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('❌ Unexpected success:', response.data);
    } catch (error) {
        console.log('✅ Expected failure:', error.response?.data);
    }
};

// Test 5: Missing description (should fail)
const testMissingDescription = async () => {
    console.log('\n📝 Test 5: Missing Description (Expected to Fail)');
    try {
        const payload = {
            title: 'Test Product'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('❌ Unexpected success:', response.data);
    } catch (error) {
        console.log('✅ Expected failure:', error.response?.data);
    }
};

// Test 6: Title too short (should fail)
const testTitleTooShort = async () => {
    console.log('\n📝 Test 6: Title Too Short (Expected to Fail)');
    try {
        const payload = {
            title: 'AB',
            description: 'This should fail because title is too short.'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('❌ Unexpected success:', response.data);
    } catch (error) {
        console.log('✅ Expected failure:', error.response?.data);
    }
};

// Test 7: Description too short (should fail)
const testDescriptionTooShort = async () => {
    console.log('\n📝 Test 7: Description Too Short (Expected to Fail)');
    try {
        const payload = {
            title: 'Test Product',
            description: 'Short'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('❌ Unexpected success:', response.data);
    } catch (error) {
        console.log('✅ Expected failure:', error.response?.data);
    }
};

// Test 8: Invalid image URL (should fail)
const testInvalidImageURL = async () => {
    console.log('\n📝 Test 8: Invalid Image URL (Expected to Fail)');
    try {
        const payload = {
            title: 'Test Product',
            description: 'This should fail because image URL is invalid.',
            image: 'not-a-valid-url'
        };

        const response = await axios.post(API_URL, payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        });

        console.log('❌ Unexpected success:', response.data);
    } catch (error) {
        console.log('✅ Expected failure:', error.response?.data);
    }
};

// Test 9: Without authentication (should fail)
const testWithoutAuth = async () => {
    console.log('\n📝 Test 9: Without Authentication (Expected to Fail)');
    try {
        const payload = {
            title: 'Test Product',
            description: 'This should fail because no auth token is provided.'
        };

        const response = await axios.post(API_URL, payload);

        console.log('❌ Unexpected success:', response.data);
    } catch (error) {
        console.log('✅ Expected failure:', error.response?.data);
    }
};

// Run all tests
const runAllTests = async () => {
    console.log('🚀 Starting Create Product API Tests\n');
    console.log('='.repeat(50));

    try {
        // Login first
        await login();

        // Run success tests
        await testMinimalPayload();
        await testWithPermission();
        await testCompletePayload();

        // Run validation tests
        await testMissingTitle();
        await testMissingDescription();
        await testTitleTooShort();
        await testDescriptionTooShort();
        await testInvalidImageURL();

        // Run auth test
        await testWithoutAuth();

        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests completed!');
    } catch (error) {
        console.error('\n❌ Test suite failed:', error.message);
    }
};

// Execute tests
runAllTests();
