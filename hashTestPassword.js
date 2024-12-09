// hashPassword.js
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        const saltRounds = 10; // You can adjust this as needed
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Hashed Password: ${hashedPassword}`);
    } catch (error) {
        console.error('Error hashing password:', error);
    }
};

// Get the password from command line arguments
const passwordToHash = process.argv[2];

if (!passwordToHash) {
    console.log('Please provide a password to hash as an argument.');
    process.exit(1);
}

hashPassword(passwordToHash);
