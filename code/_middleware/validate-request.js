module.exports = validateRequest;

function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, // Include all errors
    allowUnknown: true, // ignore unknown properties
    stripUnknown: true // Delete unknown properties
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    next(`${error.details.map((x) => x.message).join(', ')}`);
  } else {
    req.body = value;
    next();
  }
}