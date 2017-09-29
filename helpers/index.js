module.exports = {
    sendResponse: (res, data, status, message, code) => {
        let errCode = code;
        if(status === 'ok'){
            errCode = null;
        }

        return res.status(code).json({
            data,
            status,
            message,
            errCode
        });
    }
}