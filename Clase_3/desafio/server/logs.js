const chalk = require('chalk');
const { info } = require('console');
const { type } = require('os');

const log = console.log;

const types = [{
        name: 'info',
        color: 'blue',
        exec: (message) => { log(chalk.blue(message)) }
    },
    {
        name: 'warning',
        color: 'yellow',
        exec: (message) => { log(chalk.yellow(message)) }
    },
    {
        name: 'error',
        color: 'red',
        exec: (message) => { log(chalk.red(message)) }
    },
    {
        name: 'success',
        color: 'green',
        exec: (message) => { log(chalk.green(message)) }
    }
];

class Debug {

    constructor(types) {
        this.types = types;
    }

    logMssage(message, typename) {
        const usingType = types.find((type) => type.name === typename);
        usingType.exec(message);
    }

    info(message) {
        this.logMssage(message, 'info');
    }

    warning(message) {
        this.logMssage(message, 'warning');
    }

    error(message) {
        this.logMssage(message, 'error');
    }

    success(message) {
        this.logMssage(message, 'success');
    }
}


module.exports = Debug;