const success = (data, traceId) => ({
  success: true,
  data,
  ...(traceId && { traceId })
});

const error = (code, message, traceId) => ({
  success: false,
  error: {
    code,
    message
  },
  ...(traceId && { traceId })
});

module.exports = { success, error };