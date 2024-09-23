module.exports = validateRequest;

function validateRequest(roles = []) {
  // roles param can be a single role string (e.g. 'Admin') or an array of roles (e.g. ['Admin', 'User'])
  if (typeof roles === 'string') {
      roles = [roles];
  }

  return [
      // Middleware function
      (req, res, next) => {
          if (!req.auth || !roles.includes(req.auth.role)) {
              // User's role is not authorized
              return res.status(403).json({ message: 'Forbidden' });
          }

          // User's role is authorized
          next();
      }
  ];
}