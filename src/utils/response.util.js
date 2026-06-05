const success = (data) => ({
  success: true,
  data
});

const error = (code, message) => ({
  success: false,
  error: {
    code,
    message
  }
});

module.exports = { success, error };
