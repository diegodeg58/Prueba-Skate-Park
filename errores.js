const mensajesErrores = (codigo) => {
    let mensaje;
    switch (codigo) {
        case '42P01':
            mensaje = 'Nombre de tabla incorrecto';
        break;
        
        case '42703':
            mensaje = 'Columna o campo incorrecto en el SELECT';
        break;
        
        case '42883':
            mensaje = 'Tipo de dato incorrecto en la consulta';
        break;
    
        case '3D000':
            mensaje = 'Nombre de base de datos incorrecto';
        break;
        
        case '22P02':
            mensaje = 'Error de tipeo';
    
        default:
            mensaje = `Error desconocido (${codigo})`;
        break;
    };
    return mensaje;
}
module.exports = mensajesErrores;