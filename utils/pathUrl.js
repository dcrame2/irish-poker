// Where the game client should find the socket server.
// Override with NEXT_PUBLIC_SOCKET_URL in .env if you run it elsewhere.
function socketServerUrl() {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    return "https://irish-poker.onrender.com";
  }
  return "http://localhost:4101";
}

function publicFrontend() {
  if (process.env.NEXT_PUBLIC_ENV === "production") {
    return "https://irish-poker.com";
  }
  return "http://localhost:3000";
}

module.exports = {
  socketServerUrl,
  publicFrontend,
};
