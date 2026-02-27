const cron = require('node-cron');
const pool = require('../config/db');

// Función para actualizar estados de membresías vencidas
const actualizarMembresiasVencidas = async () => {
  try {
    await pool.query(`
      UPDATE CLIENTE_MEMBRESIA
      SET ESTADO = 'VENCIDO'
      WHERE FECHA_FIN < CURDATE()
      AND ESTADO = 'ACTIVO'
    `);

    console.log('Estados actualizados automáticamente');
  } catch (error) {
    console.error('Error actualizando estados:', error);
  }
};

// Programar la tarea para que se ejecute diariamente a medianoche
cron.schedule('0 0 * * *', actualizarMembresiasVencidas);

module.exports = actualizarMembresiasVencidas;