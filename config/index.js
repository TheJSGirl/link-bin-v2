//set environment varriable   

const env = process.env.NODE_ENV || 'development';

let poolConfig = null;

if(env === 'development'){
  poolConfig = {
    connectionLimit : 5,
    host            : 'localhost',
    user            : 'root',
    password        : 'pinku',
    database        : 'registerLogin'
  }
}

else if(env === 'test'){
  poolConfig = {
    connectionLimit : 5,
    host            : 'localhost',
    user            : 'root',
    password        : 'pinku',
    database        : 'registerLogin_test'
  }
}

module.exports= poolConfig;