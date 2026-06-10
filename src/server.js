require('dotenv').config();
const express = require('express');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Cron jobs ───────────────────────────────────────────────────────────────
require('./cron/membresias.cron');

// ─── Rutas ───────────────────────────────────────────────────────────────────
const clientesRoutes         = require('./routes/clientes.routes');
const membresiasRoutes       = require('./routes/membresias.routes');
const clienteMembresiaRoutes = require('./routes/cliente-membresia.routes');
const facturaRoutes          = require('./routes/factura.routes');
const usuarioRoutes          = require('./routes/usuario.routes');

app.use('/cliente',           clientesRoutes);
app.use('/membresia',         membresiasRoutes);
app.use('/cliente-membresia', clienteMembresiaRoutes);
app.use('/factura',           facturaRoutes);
app.use('/usuario',           usuarioRoutes);

// ─── Arranque ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

/*
git pull origin main   # Primero sincronizas
git add .              # Agregas cambios
git commit -m "Descripción de cambios"
git push origin main   # Luego subes tus cambios
*/