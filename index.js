const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongooose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);

const MONGODB_URI =
  'mongodb+srv://database1:faker300301@cluster0.kquz5or.mongodb.net/data';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('trust proxy', 1);
// app.use(cors());
app.use(
  cors({
    // origin: '*',
    origin: [
      'https://64d9f19b2b3e79243ac3ca41--lucky-biscotti-e4c9e6.netlify.app',
      'https://b349-2405-4802-1cb2-f640-5c54-2f62-9a5f-1de9.ngrok-free.app',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).any());

const plantsRoutes = require('./routes/plants');

const authRoutes = require('./routes/auth');

app.use('/plants', plantsRoutes);

app.use('/auth', authRoutes);

mongooose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
