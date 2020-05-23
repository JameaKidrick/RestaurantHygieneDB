const server = require('./api/server');

const PORT = process.env.PORT || 5555;

server.listen(PORT, () => {
  console.log(`=== You are listening to Port ${PORT} ===`)
})