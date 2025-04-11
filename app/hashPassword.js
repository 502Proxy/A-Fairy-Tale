// hashPassword.js
const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = '';

bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Plain Password:', plainPassword);
  console.log('Hashed Password:', hash);
});
