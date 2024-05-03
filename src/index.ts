import express from 'express';
import cors from 'cors';
import router from './router.js';
import morgan from 'morgan';
import { errorHandlingMiddleware } from './middleware/restErrorHandler.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(morgan('combined'))

const AUTH_API_ENDPOINT = 'auth';

const CORS_OPTIONS = {
  origin: [ "http://localhost:5500",
            "http://localhost:8080",
            "https://cs160-internal.pages.dev/", 
            "https://cs-160.pages.dev/" ],
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(CORS_OPTIONS));


app.use(`/${AUTH_API_ENDPOINT}`, router);

app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});