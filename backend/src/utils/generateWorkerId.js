const Worker = require("../models/Worker");

const generateWorkerId = async () => {
  const prefix = process.env.WORKER_ID_PREFIX || "ASW";
  const start = Number(process.env.WORKER_ID_START || 1001);

  const count = await Worker.countDocuments();
  const nextNumber = start + count;

  return `${prefix}-${nextNumber}`;
};

module.exports = generateWorkerId;