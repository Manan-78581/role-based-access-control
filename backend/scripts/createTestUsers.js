// Script to create test users with specific roles
const mongoose = require('mongoose');
const User = require('../src/models/user.model');
const Organization = require('../src/models/organization.model');
require('dotenv').config();

const users = [
  {
    username: 'adminuser',
    email: 'admin@test.com',
    password: 'Admin123!',
    role: 'admin',
    permissions: [
      'org:manage', 'crm:create', 'crm:read', 'crm:update', 'crm:delete',
      'projects:create', 'projects:read', 'projects:update', 'projects:delete',
      'hr:create', 'hr:read', 'hr:update', 'hr:delete',
      'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete',
      'finance:create', 'finance:read', 'finance:update', 'finance:delete',
      'roles:assign'
    ]
  },
  {
    username: 'vieweruser',
    email: 'viewer@test.com',
    password: 'Viewer123!',
    role: 'viewer',
    permissions: [
      'crm:read', 'projects:read', 'hr:read', 'inventory:read', 'finance:read'
    ]
  },
  {
    username: 'editoruser',
    email: 'editor@test.com',
    password: 'Editor123!',
    role: 'editor',
    permissions: [
      'crm:create', 'crm:read', 'crm:update',
      'projects:create', 'projects:read', 'projects:update',
      'hr:create', 'hr:read', 'hr:update',
      'inventory:create', 'inventory:read', 'inventory:update',
      'finance:create', 'finance:read', 'finance:update'
    ]
  }
];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  let org = await Organization.findOne();
  if (!org) {
    org = await Organization.create({
      name: 'TestOrg',
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
  }

  for (const u of users) {
    let user = await User.findOne({ email: u.email });
    if (!user) {
      user = new User({
        ...u,
        organizationId: org._id,
        profile: {
          firstName: u.username,
          avatar: `https://ui-avatars.com/api/?name=${u.username}&background=random`
        },
        active: true
      });
      await user.save();
      console.log(`Created user: ${u.email} (${u.role})`);
    } else {
      // Update role, permissions, and password if needed
      let updated = false;
      if (user.role !== u.role) {
        user.role = u.role;
        updated = true;
      }
      if (JSON.stringify(user.permissions) !== JSON.stringify(u.permissions)) {
        user.permissions = u.permissions;
        updated = true;
      }
      // Only update password if changed
      const bcrypt = require('bcryptjs');
      const isSame = await bcrypt.compare(u.password, user.password);
      if (!isSame) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(u.password, salt);
        updated = true;
      }
      user.active = true;
      user.organizationId = org._id;
      await user.save();
      if (updated) {
        console.log(`Updated user: ${u.email} (${u.role})`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }
  }
  mongoose.disconnect();
}

main().catch(err => {
  console.error('Error creating test users:', err);
  mongoose.disconnect();
});
