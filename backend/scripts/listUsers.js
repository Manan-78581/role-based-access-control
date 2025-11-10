require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/user.model');

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const users = await User.find({}, 'username email role permissions organizationId active createdAt').lean();
    console.log('Users:');
    users.forEach(u => console.log(JSON.stringify(u, null, 2)));

    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
}

main();
