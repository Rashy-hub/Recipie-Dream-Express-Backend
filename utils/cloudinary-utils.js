// cloudinary-utils.js
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'
import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Télécharge un fichier vers Cloudinary
 *
 * @param {string} resourceType - Type de ressource (image, raw, etc.)
 * @param {string} folderPath - Chemin du dossier dans Cloudinary
 * @param {Buffer} buffer - Contenu du fichier à télécharger
 * @param {string} publicId - Identifiant public pour le fichier
 * @returns {Promise<Object>} - Résultat de l'upload
 */
export const uploadToCloudinary = (resourceType, folderPath, buffer, publicId) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType, folder: folderPath, public_id: publicId },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result)
            }
        )

        streamifier.createReadStream(buffer).pipe(uploadStream)
    })
}
