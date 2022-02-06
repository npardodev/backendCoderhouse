const express = require('express');
const multer = require('multer');
const { Router } = express;
let { Server: HTTPServer } = require('http');
let { Server: SocketIO } = require('socket.io');
const Debug = require('./debug.js');
const Container = require('./Contenedor.js');
const myServer = require('./config.js');
const myLogger = require('./logs.js');
let path = require("path");

const app = express();
const myRouter = new Router();
app.use('/app/', myRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/css', express.static('public/css'));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

let http = new HTTPServer(app);
let io = new SocketIO(http);
const log = myLogger;
const db = new Debug();
const container = new Container('./data/productos.txt');

//Config multer
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
})
let upload = multer({ storage: storage });

let messages = [{
        user: 'pepe',
        message: 'Mensaje generico de inicio',
        date: '11/20/2018'
    },
    {
        user: 'Maria',
        message: 'Techamos de menos porque nos quedamos sin tejas',
        date: '22/11/2019'
    }
];

// Cargo los productos al principio
let products = [];
(async() => {
    products = await container.getAll();
    console.log(products);
})();

//Captura del evento de conexion al socket.
io.on("connection", socket => {

    console.log("Nuevo cliente conectado", socket.id);
    socket.emit('init', 'Starting connect');


    socket.emit('messages', messages);
    socket.emit('products', products);


    //Productos 
    socket.on("new-product", data => {
        console.log("----------------------------")
        products.push({...data, id: products.length + 1 });
        io.sockets.emit('products', products);
    });

    //Mensajes Chat
    socket.on("new-message", data => {
        console.log("----------------------------")
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

})

app.get('/', async(req, res, next) => {

    try {
        products = await container.getAll();
        if (products) {
            res.render('./layout/index', { products: products });
        } else {
            log.warn(`No hay productos, ${myServer.error}`);
            res.status(400).json({ "error": 'Productos no encontrados' });
        }
    } catch {
        res.json({ error: `Error, obteniendo productos` });
    }
})

//Subida
myRouter.post('/uploadProducts', upload.single('image'), (req, res, next) => {

    const file = req.file;
    const title = req.body.title;
    const price = req.body.price;

    if (!file) {
        const error = new Error('Por favor suba un archivo');
        error.httpStatusCode = 400;
        return next(error);
        res.json(`Error en la carga del productos`);

    } else {

        const newProduct = {
            title: title,
            price: price,
            thumbnail: `./uploads/${file.filename}`
        }
        container.save(newProduct);
        res.send(`Producto subido en forma correcta`);
    }
});

http.listen(myServer.port, () => {
    console.log(`Servidor corriendo en el puerto ${myServer.port}`);
});

http.on('error', err => {
    if (error) new Error('Error escuchando en el puerto');
    log.error(`Error ejecutando el servidor, ${myServer.error}`);

})