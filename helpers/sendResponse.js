const sendResponse = (res, statusCode, data, message) => {

    // regex pattern to validate that the status code is always 3 digits in length
    const lengthPattern = /^[0-9]{3}$/;

    if(!lengthPattern.test(statusCode)){
        throw new Error('HTTPStatusCode should be a 3-digit number'); 
    }

    if(typeof message !== 'string'){
        throw new Error('Message should be a string');
    }

    let status = null; // for sending status: 'ok'/'failed

    // regex to test that status code start with 2 and should me 3 digits in length 
    const pattern = /^2\d{2}$/;

    // if the status code starts with 2, set satus variable as 'ok
    pattern.test(statusCode) ? status = 'ok' : status = 'failed';



    return res.status(statusCode).json({
        status,
        data,
        message
    });
}


module.exports = sendResponse;