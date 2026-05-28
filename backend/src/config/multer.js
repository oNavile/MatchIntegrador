// src/config/multer.js
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const pastaUpload = path.resolve(__dirname, '../../uploads');

// Garante que as pastas existem
['curriculos', 'logos'].forEach(sub => {
  const dir = path.join(pastaUpload, sub);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Rota define qual pasta usar via req.uploadFolder
    const pasta = req.uploadFolder || 'curriculos';
    cb(null, path.join(pastaUpload, pasta));
  },
  filename: (req, file, cb) => {
    const ext    = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const permitidos = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (permitidos.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use PDF, DOC, DOCX ou imagens.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: (parseInt(process.env.UPLOAD_MAX_SIZE_MB) || 5) * 1024 * 1024 },
});

module.exports = upload;
