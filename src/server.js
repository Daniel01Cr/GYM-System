require('dotenv').config();
const express = require('express');

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());

// ─── Cron jobs ───────────────────────────────────────────────────────────────
require('./cron/membresias.cron');

// ─── Rutas ───────────────────────────────────────────────────────────────────
const authRoutes             = require('./routes/auth.routes');
const clientesRoutes         = require('./routes/clientes.routes');
const membresiasRoutes       = require('./routes/membresias.routes');
const clienteMembresiaRoutes = require('./routes/cliente-membresia.routes');
const facturaRoutes          = require('./routes/facturas.routes');
const usuarioRoutes          = require('./routes/usuarios.routes');

// Pública — no requiere token
app.use('/auth',              authRoutes);

// Protegidas — cada router aplica verificarToken internamente
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