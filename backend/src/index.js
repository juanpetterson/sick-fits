require('dotenv').config({ path: '.env' });
const cookieParser = require('cookie-parser');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO Use express middleware to handle cookies (jwt)
server.express.use(cookieParser());
// TODO Use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
