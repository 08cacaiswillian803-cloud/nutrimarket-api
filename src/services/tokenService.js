const jwt = require('jsonwebtoken');
function signToken(user) {
  const secret = process.env.JWT_SECRET || (process.env.NODE_ENV === 'test' ? 'test-secret-key-at-least-32-characters' : 'development-secret-change-before-deploy');
  return jwt.sign({ sub: user._id.toString() }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '1h', issuer: 'nutrimarket-api', audience: 'nutrimarket-client' });
}
module.exports = { signToken };
