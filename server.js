const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { PORT = 5050 } = process.env;
const morgan = require('morgan');
const cors = require('cors');
const v1Routes = require('./routes/v1');
const v2Routes = require('./routes/v2');
const expressValidator = require('express-validator');


const staticFilePath = path.join(__dirname, './public' );
   

//app initiate
const app = express();  


//view setup
//serving static file
app.use(express.static(staticFilePath));
// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(morgan('dev'));

//home route
app.get('/', (req, res) => {
    return res.sendFile(staticFilePath);
});

//route middleware
app.use('/api', v1Routes);
app.use('/api', v2Routes);



app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-consol
