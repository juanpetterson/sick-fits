require('dotenv').config({ path: '.env' });
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// Use express middleware to handle cookies (jwt)
server.express.use(cookieParser());
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
});

server.express.use(async (req, res, next) => {
  if (!req.userId) return next();

  const userReturnData = `{
    id, 
    permissions, 
    email, 
    name
  }`;

  const user = await db.query.user({ where: { id: req.userId } }, userReturnData);
  req.user = user;
  next();
});

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
