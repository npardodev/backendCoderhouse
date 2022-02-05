const chalk = require("chalk");
const os = require("os")

const log_debug = console.log;

const types = [{
        name: 'info',
        color: 'blue',
        exec: (message) => { log_debug(chalk.blue(message)) }
    },
    {
        name: 'warning',
        color: 'yellow',
        exec: (message) => { log_debug(chalk.yellow(message)) }
    },
    {
        name: 'error',
        color: 'red',
        exec: (message) => { log_debug(chalk.red(message)) }
    },
    {
        name: 'success',
        color: 'green',
        exec: (message) => { log_debug(chalk.green(message)) }
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