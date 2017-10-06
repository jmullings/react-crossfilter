import express from 'express';
import bodyParser from 'body-parser';
import config from './config';
import apiRouter from './api';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// -- routes
app.use('/api', apiRouter);

// -- start app
app.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
//app.listen(process.env.PORT || 5000)
 export default app;