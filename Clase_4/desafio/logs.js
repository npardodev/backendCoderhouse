const winston = require('winston');

const LOG_PATH = 'logs';
//Creacion del Logger
const myLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //new winston.transports.Console(),
        new winston.transports.File({ filename: `./${LOG_PATH}/warning.log`, level: 'warning' }),
        new winston.transports.File({ filename: `./${LOG_PATH}/info.log`, level: 'info' }),
        new winston.transports.File({ filename: `./${LOG_PATH}/error.log`, level: 'error' }),
        new winston.transports.File({ filename: `./${LOG_PATH}/combined.log` }),
    ],
});


module.exports = myLogger;