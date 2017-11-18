'use strict';

const secret = process.env.JWT_KEY;
const jwt = require('jsonwebtoken');

function createToken(user) {
  let scope;
  // Check if the user object passed in
  // has admin set to true, and if so, set
  // scopes to admin
  if (user.is_admin) {
    scope = 'admin';
  }

  // Sign the JWT
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      scope
    },
    secret,
    {
      algorithm: 'HS256',
      expiresIn: '1h'
    }
  );
}

module.exports = createToken;