// routes/parseReceipt.js
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parseReceiptWithGemini } from '../utils/geminiParser.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await parseReceiptWithGemini(filePath);

    // Delete temp file
    fs.unlinkSync(filePath);

    res.json({ transactions: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to parse receipt' });
  }
});

export default router;
