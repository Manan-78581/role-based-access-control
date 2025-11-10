const mongoose = require('mongoose');
const User = require('../models/user.model');
const Organization = require('../models/organization.model');
require('dotenv').config();

const testUsers = [
    {
        username: 'admin',
        email: 'admin@test.com',
        password: 'Admin123!',
        role: 'admin',
        permissions: [
            'org:manage', 'org:read',
            'users:create', 'users:read', 'users:update', 'users:delete',
            'roles:assign', 'roles:read',
            'crm:create', 'crm:read', 'crm:update', 'crm:delete',
            'hr:create', 'hr:read', 'hr:update', 'hr:delete',
            'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete',
            'finance:create', 'finance:read', 'finance:update', 'finance:delete',
            'projects:create', 'projects:read', 'projects:update', 'projects:delete'
        ]
    },
    {
        username: 'manager',
        email: 'editor@test.com',
        password: 'Editor123!',
        role: 'manager',
        permissions: [
            'org:read',
            'crm:create', 'crm:read', 'crm:update',
            'projects:create', 'projects:read', 'projects:update',
            'hr:read', 'hr:update',
            'inventory:read', 'inventory:update'
        ]
    },
    {
        username: 'viewer',
        email: 'viewer@test.com',
        password: 'Viewer123!',
        role: 'viewer',
        permissions: [
            'org:read',
            'crm:read',
            'projects:read',
            'hr:read',
            'inventory:read',
            'finance:read'
        ]
    }
];

async function seedTestUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create test organization
        let testOrg = await Organization.findOne({ name: 'Test Organization' });
        if (!testOrg) {
            testOrg = await Organization.create({
                name: 'Test Organization',
                domain: 'test.com',
                settings: {
                    modules: [
                        { name: 'crm', enabled: true },
                        { name: 'projects', enabled: true },
                        { name: 'hr', enabled: true },
                        { name: 'inventory', enabled: true },
                        { name: 'finance', enabled: true }
                    ]
                }
            });
            console.log('Created test organization');
        }

        // Create test users
        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User({
                    ...userData,
                    organizationId: testOrg._id,
                    profile: {
                        firstName: userData.username,
                        avatar: `https://ui-avatars.com/api/?name=${userData.username}&background=random`
                    }
                });
                await user.save();
                console.log(`Created test user: ${userData.email}`);
            } else {
                console.log(`User already exists: ${userData.email}`);
            }
        }

        console.log('\n✅ Test users created successfully!');
        console.log('\n📧 Test Credentials:');
        console.log('Admin: admin@test.com / Admin123!');
        console.log('Editor: editor@test.com / Editor123!');
        console.log('Viewer: viewer@test.com / Viewer123!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding test users:', error);
        process.exit(1);
    }
}

seedTestUsers();