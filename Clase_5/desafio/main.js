const express = require('express');
const multer = require('multer');
const handlebars = require('express-handlebars');
const pug = require('pug');
const helmet = require('helmet');
const Joi = require('joi');
const { Router } = express;
const Debug = require('./debug.js');
const Container = require('./Contenedor.js');
const myServer = require('./config.js');
const myLogger = require('./logs.js');

const log = myLogger;
const db = new Debug();
const container = new Container('./data/productos.txt');

const app = express();
const myRouter = new Router();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'public'));
app.use('/css', express.static('public/css'));
app.use('/app/', myRouter);

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

//Seguridad
app.disable('x-powered-by');



////////////////////////////////////////////////////////////////////////
//////////////////////// MOTOR DE PLANTILLAS ///////////////////////////
////////////////////////////////////////////////////////////////////////

const HANDLEBARS_ENGINE = 0;
const PUG_ENGINE = 1;
const EJS_ENGINE = 2;

//Cambiar por el deseado
const USED_ENGINE_MOTOR = EJS_ENGINE;

const engines = [{
        name: 'handlebars',
        path: './Handlebars/views/',
        renderView: 'productsView',
        renderUpload: 'productsUpload',
    },
    {
        name: 'pug',
        path: './Pug/views/',
        renderView: 'productsView.pug',
        renderUpload: 'productsUpload.pug',
    },
    {
        name: 'ejs',
        path: './ejs/views/',
        renderView: 'productsView.ejs',
        renderUpload: 'productsUpload.ejs',
    },
];

//Cambiar el index del arreglo para cambiar de motor de plantilla
app.set('view engine', engines[USED_ENGINE_MOTOR].name);
app.set('views', engines[USED_ENGINE_MOTOR].path);


//handlebars
const hbs = handlebars.create({
    extname: '.handlebars',
    defaultLayout: 'index.handlebars',
    layoutsDir: __dirname + '/Handlebars/views/layouts',
    partialsDir: __dirname + '/Handlebars/views/partials',
})
app.engine('handlebars', hbs.engine);




////////////////////////////////////////////////////////////////////////
////////////////////////////////  RUTAS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

myRouter.get('/productos', async function(req, res, next) {

    try {
        let productos = await container.getAll();
        if (productos) {
            res.render(engines[USED_ENGINE_MOTOR].renderView, { products: productos });
        } else {
            log.warn(`No hay productos, ${myServer.error}`);
            res.status(400).json({ "error": 'Productos no encontrados' });
        }
    } catch {
        res.json({ error: `Error, obteniendo productos` });
    }

});


myRouter.get('/uploadProducts', function(req, res, next) {
    res.render(engines[USED_ENGINE_MOTOR].renderUpload);
});

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


//Redirect path inválido
app.get('*', (req, res) => {
    res.send("holaaa");
});

//Inicia server
const server = app.listen(myServer.port, () => {
    console.log(`Servidor corriendo en el puerto ${myServer.port}`);
})

//Si falla levantando el server
server.on('error', (error) => {
    log.error(`Error ejecutando el servidor, ${myServer.error}`);
});