const express         = require('express');
const bodyParser      = require('body-parser');
const path            = require('path');
const { PORT = 5050 } = process.env;
const morgan          = require('morgan');
const cors            = require('cors');
const v1Routes        = require('./routes/v1');

//app initiate
const app = express();  

//view setup

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//route middleware
app.use('/api/v1', v1Routes);

// app.get('/', (req, res)=> {
//   res.send('GET route');
// });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-consol
