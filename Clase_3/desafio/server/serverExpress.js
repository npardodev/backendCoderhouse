const express = require('express');
const Debug = require('./logs.js');
const Container = require('./Contenedor.js');


const getRandom = (array) => { return array[Math.floor(Math.random() * array.length)]; }

const PORT = process.env.PORT || 8080;
const URL = 'http://localhost';
let countVisits = 0;

const myServer = {
    port: PORT,
    url: URL
}

const app = express();
const log = new Debug();
const container = new Container('./productos.txt');

const server = app.listen(myServer.port, () => {
    log.info(`Servidor corriendo en el puerto ${myServer.port}`);
})

// =================================================================
// Rutas:
// =================================================================

app.get('/productos', async(req, res, next) => {

    try {
        const products = await container.getAll();
        res.json(products);

    } catch (error) {
        log.error(`Error cargando lista de productos, ${error}`);

    }
})

app.get('/productoRandom', async(req, res, next) => {

    try {
        const products = await container.getAll();
        const random = getRandom(products);
        res.json(random);

    } catch (error) {
        log.error(`Error cargando lista de productos, ${error}`);
    }

})


// Si ocurre algun error 
server.on("error", error => {
    log.error(`Error ejecutando el servidor, ${myServer.error}`);
})