const express = require('express');
const app = express();
require('./config/db');

app.use(express.json());

const clientesRoutes = require('./routes/clientes.routes');
app.use('/cliente', clientesRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});