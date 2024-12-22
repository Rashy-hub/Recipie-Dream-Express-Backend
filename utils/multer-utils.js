import multer from 'multer'

/**
 * Configuration pour multer avec stockage en mémoire
 *
 * @param {Object} options - Configuration pour multer
 * @returns {multer.Options} - Options pour multer
 */
const multerStorageOptions = (options = { fields: [] }) => {
    const storage = multer.memoryStorage() // Stockage en mémoire

    return {
        storage,
        limits: {
            fileSize: options.maxFileSize || 10 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (options.allowedMimeTypes && !options.allowedMimeTypes.includes(file.mimetype)) {
                return cb(new Error('Invalid file type'), false)
            }
            cb(null, true)
        },
    }
}

export default multerStorageOptions
