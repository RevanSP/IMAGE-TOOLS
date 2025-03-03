const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_, file, cb) => cb(
        ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/tiff', 'image/avif'].includes(file.mimetype)
            ? null : new Error('Format file tidak didukung!'),
        true
    )
});

const supportedFormats = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'avif', 'tiff'];

const convertImage = async (req, res, download = false) => {
    if (!req.file) return res.status(400).send('Tidak ada file yang diupload');

    const { format: targetFormat } = req.query;

    if (!supportedFormats.includes(targetFormat)) {
        return res.status(400).send(`Format ${targetFormat} tidak didukung`);
    }

    try {
        const convertedBuffer = await sharp(req.file.buffer).toFormat(targetFormat).toBuffer();

        if (download) {
            res.set('Content-Type', `image/${targetFormat}`);
            res.set('Content-Disposition', `attachment; filename=${req.file.originalname.split('.')[0]}.${targetFormat}`);
            return res.send(convertedBuffer);
        }

        const dataUrl = `data:image/${targetFormat};base64,${convertedBuffer.toString('base64')}`;
        res.status(200).json({
            message: `Gambar berhasil dikonversi ke ${targetFormat}!`,
            originalName: req.file.originalname,
            convertedName: `${req.file.originalname.split('.')[0]}.${targetFormat}`,
            dataUrl,
            mimeType: `image/${targetFormat}`
        });
    } catch (error) {
        console.error('Error konversi gambar:', error);
        res.status(500).json({ error: 'Gagal mengonversi gambar', details: error.message });
    }
};

app.use(express.static(path.join(__dirname, 'public')));

app.post('/convert', upload.single('image'), (req, res) => convertImage(req, res));
app.post('/convert-download', upload.single('image'), (req, res) => convertImage(req, res, true));

app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));