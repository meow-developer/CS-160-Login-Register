import express from 'express';
import cors from 'cors';
import router from './router.js';
import morgan from 'morgan';
import { errorHandlingMiddleware } from './middleware/restErrorHandler.js';
import HostnameData from './data/hostname.json' assert { type: 'json' };

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(morgan('combined'))

const AUTH_API_ENDPOINT = 'auth';

const CORS_OPTIONS = {
  origin: HostnameData.frontend_cors_origin,
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