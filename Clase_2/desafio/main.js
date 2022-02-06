import { Container } from './Contenedor.js';

const myContainer = new Container('./productos.txt');

const newProduct = {
    title: "Escuadra",
    price: 123.45,
    thumbnail: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
    "id": 1
};


async function executionTest() {
    try {
        await myContainer.getAll();
        await myContainer.getById(2)
            .then((result) => { console.log(result) });
        await myContainer.deleteById("1");
        await myContainer.save(newProduct);
        await myContainer.deleteAll();
        await myContainer.create();
        await myContainer.deleteAll()
        await myContainer.deleteFile();

    } catch (err) {
        console.log('Error en ejecucion', err);
    }
}



executionTest();