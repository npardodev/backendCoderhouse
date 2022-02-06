const express = require('express');
const app = express();
let { Server: HTTPServer } = require('http');
let { Server: SocketIO } = require('socket.io');
let path = require("path");
const PORT = process.env.PORT || 3001;
const URL = 'https:localhost.com'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

let http = new HTTPServer(app);
let io = new SocketIO(http);


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

//Captura del evento de conexion al socket.
io.on("connection", socket => {

    console.log("Nuevo cliente conectado", socket.id);


    socket.emit('init', 'Estamos conectados');


    socket.emit('messages', messages);



    socket.on("new-message", data => {
        console.log("----------------------------------------------------------------")
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

    socket.on("Hola_server", data => {
        console.log("----------------------------------------------------------------")
        console.log(data);
    });

    socket.on("from_font", data => {
        console.log("----------------------------------------------------------------")
        students.push({...data, id: socket.id, date: new Date() });
        socket.emit('fill_message', students);

    });




})

app.get('/', (req, res, next) => {
    res.render('index', {});
})

http.listen(PORT, () => {
    console.log(`Server listen on ${URL}?${PORT} `);
});

http.on('error', err => {
    if (error) new Error('Error escuchando en el puerto');
})