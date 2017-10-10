const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { PORT = 5050 } = process.env;
const morgan = require('morgan');
const cors = require('cors');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
const expressValidator = require('express-validator');

   

//app initiate
const app = express();  


//view setup

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(morgan('dev'));

//route middleware
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// app.get('/', (req, res)=> {
//   res.send('GET route');
// });

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-consol
