const express = require('express');
const multer = require('multer');
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

//Config multer
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
})

const app = express();
const myRouter = new Router();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + 'public'));
app.use('/css', express.static('public/css'));
app.use('/api/productos', myRouter);
let upload = multer({ storage: storage });

//Seguridad
app.disable('x-powered-by');


////////////////////////////////////////////////////////////////////////
////////////////////////////////  RUTAS ////////////////////////////////
////////////////////////////////////////////////////////////////////////

// Uploads de productos
myRouter.get('/uploadProducts', function(req, res, next) {
    res.sendFile(__dirname + '/public/products.html');
});

myRouter.post('/uploadProduct', upload.single('image'), (req, res, next) => {
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


//agrega
myRouter.post('/', async(req, res, next) => {
    let product = req.body;
    try {
        let result = await container.save(product);
        res.json({ resultado: `Producto subido en forma correcta` });
    } catch {
        res.json({ resultado: `Error agregando producto` });
    }

})

//modifica
myRouter.put('/:id', async(req, res, next) => {
    let { id } = req.params;
    let { newProduct } = req.body;
    let result = await container.modifyById(id, newProduct);
})

//delete
myRouter.delete('/:id', async(req, res, next) => {
    let { id } = req.params;
    let result = await container.deleteById(id);
})



myRouter.get('/:id', async(req, res, next) => {
    let id = Number(req.params.id);

    try {
        let result = await container.getById(id);
        if (result.length == 0) {
            log.warn(`No hay productos con ese id, ${myServer.error}`);
            res.status(500).json({ error: `No hay productos con ese id` });
            return;
        }
        res.status(200).send(result);

    } catch (error) {
        res.status(400).json({ error: `No hay productos con ese id` });
        log.warn(`No hay productos con ese id, ${myServer.error}`);
        db.error(`Error realizando consulta por ID, ${error}`);
    }


})

//Todos los productos
myRouter.get('/', async(req, res, next) => {

    try {
        let productos = await container.getAll();
        if (productos) {
            res.status(200).json({ productos });
        } else {
            log.warn(`No hay productos, ${myServer.error}`);
            res.status(400).json({ "error": 'Productos no encontrados' });
        }
    } catch {
        res.json({ error: `Error, obteniendo productos` });
    }

})


//Redirect path inválido
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/NotFound.html');
});


//Inicia server
const server = app.listen(myServer.port, () => {
    db.info(`Servidor corriendo en el puerto ${myServer.port}`);
    log.info(`Servidor corriendo en el puerto ${myServer.port}`);
})


//Si falla levantando el server
server.on('error', (error) => {
    log.error(`Error ejecutando el servidor, ${myServer.error}`);
});



/*
EN TEST:

const validateId = (id) => {
    const schema =   {
        id: Joi.string().regex(/^[0-9]{10}$/)
    }
    return Joi.validate(id, schema);
}

// luego invocarlo...
const { error } = validateId(id);
if (error) return res.status(400).send;

*/