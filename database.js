const { Pool } = require('pg');
const mensajesErrores = require('./errores.js');

const pool = new Pool({
    user: 'postgres',
    database: 'skatepark',
    password: 'postgres',
    host: 'localhost',
    port: 5432
});

const SQLquery = async (query) => {
    try {
        const res = await pool.query(query);
        return res.rows;
    } catch (error) {
        console.log(mensajesErrores(error.code));
        //TODO: retornar objeto error
        return error;
    }
};

const listarUsuarios = async () => {
    const config = {
        text: "SELECT * FROM skaters ORDER BY id",
        values: [],
    }
    return await SQLquery(config);
};

const obtenerUsuario = async (email) => {
    const config = {
        text: "SELECT * FROM skaters WHERE email = $1",
        values: [email],
    }
    return await SQLquery(config);
}

const registrarUsuario = async (datos) => {
    const {email, nombre, password, anos_experiencia, especialidad, foto} = datos;
    const config = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1, $2, $3, $4, $5, $6, false) RETURNING *",
        values: [email, nombre, password, anos_experiencia, especialidad, foto],
    }
    return await SQLquery(config);
}

const actualizarLista = async (datos) => {
    datos.forEach(item => {
        const config = {
            text: "UPDATE skaters SET estado = $1 WHERE id = $2",
            values: [item.estado == 'true' ? true : false, item.id],
        }
        SQLquery(config);
    });
}

const actualizarUsuario = async (datos) => {
    const {email, nombre, password, anos_experiencia, especialidad} = datos;
    const config = {
        text: `UPDATE skaters
            SET nombre = $1,
            password = $2,
            anos_experiencia = $3,
            especialidad = $4
            WHERE email = $5`,
        values: [nombre, password, anos_experiencia, especialidad, email],
    }
    await SQLquery(config);
}

const eliminarUsuario = async (datos) => {
    const {email} = datos;
    const config = {
        text: `DELETE FROM skaters WHERE email = $1 RETURNING *`,
        values: [email],
    }
    return await SQLquery(config);
}

module.exports = {listarUsuarios,obtenerUsuario, registrarUsuario, actualizarLista, actualizarUsuario, eliminarUsuario};