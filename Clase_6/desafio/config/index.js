require("dotenv").config();

const config = {
    port: process.env.PORT,
    url: process.env.URL,
    class: process.env.CLASE,
}

let sockets = {

};

module.exports = { config, sockets };