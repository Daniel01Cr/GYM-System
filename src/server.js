const express = require('express');
const app = express();
require('./config/db');

app.use(express.json());

const clientesRoutes = require('./routes/clientes.routes');
const membresiasRoutes = require('./routes/membresias.routes');
const clienteMembresiaRoutes = require('./routes/cliente-membresia.routes');

app.use('/cliente', clientesRoutes);
app.use('/membresia', membresiasRoutes);
app.use('/cliente-membresia', clienteMembresiaRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});



/*

git pull origin main   # Primero sincronizas
git add .              # Agregas cambios
git commit -m "Descripción de cambios"
git push origin main   # Luego subes tus cambios

*/