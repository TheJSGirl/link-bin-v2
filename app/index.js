const express    = require('express');
const bodyParser = require('body-parser');
const path       = require('path');
const { PORT = 5050 } = process.env;


//app initiate
const app = express();  

//view setup

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res)=> {
  res.send('GET route');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); // eslint-disable-line no-consol
