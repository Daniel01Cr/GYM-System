const cron = require('node-cron');
const express = require('express');
const pool = require('./config/db');
require('./cron/membresias.cron');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const clientesRoutes = require('./routes/clientes.routes');
const membresiasRoutes = require('./routes/membresias.routes');
const clienteMembresiaRoutes = require('./routes/cliente-membresia.routes');

app.use('/cliente', clientesRoutes);
app.use('/membresia', membresiasRoutes);
app.use('/cliente-membresia', clienteMembresiaRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

/*

git pull origin main   # Primero sincronizas
git add .              # Agregas cambios
git commit -m "Descripción de cambios"
git push origin main   # Luego subes tus cambios

*/