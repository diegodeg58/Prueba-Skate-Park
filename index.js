//Intento 1, creo que cumple con los requerimientos de la prueba
//Pero de completar con los detalles como validaciones o el tiempo de expiración
//Podría tomar más tiempo jajaja
const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const db = require('./database.js');
const fileupload = require('express-fileupload');
const fs = require('fs');

const llavePrivada = "passwordgenerico1234";
let usuarioConectado;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', express.static(`${__dirname}/assets/css`));
app.use('/', express.static(`${__dirname}/data/images`));
app.use(fileupload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "El archivo supera el límite permitido"
}));

app.set("view engine", "handlebars");

app.engine(
    "handlebars",
    hbs.engine({
        layoutsDir: `${__dirname}/views`,
        partialsDir: `${__dirname}/views/partials`
    })
);

const servidor = 'localhost';
const puerto = 3000;

app.listen(puerto, () => console.log(`Servidor activo http://${servidor}:${puerto}`));

app.get('/', async (req, res) => {
    const lista = await db.listarUsuarios();
    res.render("index", {
        layout: "index",
        lista: lista
    })
});

app.get('/login', (req, res) => {
    res.render("login", {
        layout: "login"
    })
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(email == 'admin@skate.com' && password == 'password'){
        const token = jwt.sign({email, password}, llavePrivada);
        return res.json({
            message: 'Autenticación exitosa',
            token: token,
            url: '/admin'
        });
    }else{
        const [usuario] = await db.obtenerUsuario(email);
        if(!usuario) return res.status(404).json({message: 'Error: Usuario no encontrado'});
        if(usuario.password != password) return res.status(403).json({message: 'Error: Contraseña inválida'});
        const token = jwt.sign(usuario, llavePrivada);
        
        return res.json({
            message: 'Autenticación exitosa',
            token: token,
            url: '/datos'
        });
    }
});

app.get('/registro', (req, res) => {
    res.render("registro", {
        layout: "registro"
    });
});

app.post('/registro', async (req, res) => {
    const imagen = req.files.foto;
    let datos = req.body;
    datos.anos_experiencia = parseInt(datos.anos_experiencia);
    datos.foto = imagen.name;
    const [lista] = (await db.registrarUsuario(datos));
    imagen.mv(`${__dirname}/data/images/${imagen.name}`)
    res.json({
        message: `Se ha ingresado a\n${lista.nombre}\ncon el id: ${lista.id}`
    });
});

app.use('/admin', (req, res, next) => {
    let token = req.query.token ? req.query.token : req.headers.authorization;
    jwt.verify(token, llavePrivada, (error, data) => {
        if(error)
            return res.status(403).send({ message: 'Token inválido'})
        if(data.email == 'admin@skate.com'){
            usuarioConectado = data;
            return next();
        }else{
            return res.status(403).send({ message: 'Usuario inválido'})
        }
    });
});

app.get('/admin', async (req, res) => {
    const lista = await db.listarUsuarios();
    res.render("admin", {
        layout: "admin",
        lista: lista
    })
});

app.put('/admin', async (req, res) => {
    await db.actualizarLista(req.body.datos);
    res.json({message: 'Datos actualizados'});
});

app.use('/datos', (req, res, next) => {
    let token = req.query.token ? req.query.token : req.headers.authorization;
    jwt.verify(token, llavePrivada, (error, data) => {
        if(error){
            res.status(403).send({ message: 'token inválido'})
        } else {
            usuarioConectado = data;
            next();
        }
    })
});

app.get('/datos', async (req, res) => {
    const [usuario] = await db.obtenerUsuario(usuarioConectado.email);
    res.render("datos", {
        layout: "datos",
        participante: usuario
    })
});

app.put('/datos', async (req, res) => {
    await db.actualizarUsuario(req.body);
    res.json({message: 'Datos actualizados'});
});

app.delete('/datos', async (req, res) => {
    const [usuario] = await db.eliminarUsuario(req.body);
    fs.unlinkSync(`${__dirname}/data/images/${usuario.foto}`)
    res.json({message: "Usuario eliminado"});
});

//TODO: Implementar las excepciones si hay errores en la base de datos