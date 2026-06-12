const multer = require('multer');

// Make sure the file is an image
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

// Define how we want to save uploaded photos in our server
const storage = multer.diskStorage({
    // Each Photo will:

    // Be saved in uplaods directory
    destination: (req, file, cb) => cb(null, 'uploads/'),
    // Be saved as : specificDate-FileName.png
    // We want to prevent from different users that each uploads photoes with the same name to override each other
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

// Variable that combines both of the actions: szve
const upload = multer({ storage, fileFilter });

// The actual Middleware:
// Try to upload the photo - if it worked, next()
// Else send an error
const photoUploadMiddleware = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

module.exports = photoUploadMiddleware;