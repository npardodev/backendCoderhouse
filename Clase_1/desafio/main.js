function User(nombre, apellido, libros = [], mascotas = []) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.libros = libros;
    this.mascotas = mascotas;

    this.getFullName = function() {
        return (`el nombre completo es ${this.nombre} ${this.apellido}`);
    };

    this.addMascota = function(mascota) {
        this.mascotas.push(mascota);
    };

    this.getMascotas = function() {
        return this.mascotas.length;
    };

    this.addBook = function(book, autor) {
        this.libros.push({ nombre: book, autor: autor });
    };

    this.getBooks = function(book, autor) {
        let nombreLibros = [];
        this.libros.map((libro) => {
            return nombreLibros.push(libro.nombre);
        })
        return nombreLibros;
    };
}

let librosDeMaria = [];
let mascotasDeMaria = [];
let maria = new User("Maria", "Gonzales", librosDeMaria, mascotasDeMaria);


console.log("----------------------");
console.log("------ Con func.------");
console.log("----------------------");

console.log(maria.getFullName());
maria.addMascota("Kiara");
maria.addMascota("Goofy");
maria.addBook("Mi planta de naranja lima", "José Mauro de Vasconcelos");
maria.addBook("Crónicas del ángel gris", "Alejandro Dolina");
maria.addBook("Rayuela", "Cortazar");
console.log(`la cantidad de mascotas es ${maria.getMascotas()}`);
console.log(`Los libros acumulados son ${maria.getBooks()}`);