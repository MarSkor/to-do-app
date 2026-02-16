const errorHandler = (error) => {
  if (error.response && error.response.data) {
    return (
      error.response.data.message ||
      error.response.data.error ||
      "Request failed"
    );
  }

  if (error.request) {
    return "Network error. Please check your connection.";
  }

  return "Something went wrong.";
};

export default errorHandler;
