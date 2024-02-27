function socketServerUrl() {
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    return "https://irish-poker.onrender.com";
  } else {
    return "http://localhost:3001";
  }
}

function publicFrontend() {
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    return "https://irish-poker.com";
  } else {
    return "http://localhost:3000";
  }
}

module.exports = {
  socketServerUrl,
  publicFrontend,
};
