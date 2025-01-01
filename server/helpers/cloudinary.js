const cloudinary = require("cloudinary").v2;

// Configure with environment data
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Функция за качване на файл в Cloudinary
const uploadMediaToCloudinary = async (filePath, resourceType = "auto") => {
  if (!filePath) {
    throw new Error("No file path provided for upload");
  }
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: resourceType,  // "video" или "raw" за PDF
      secure: true,  // Използване на сигурни URL-та
    });

    if (!result || !result.url) {
      throw new Error("Cloudinary did not return a valid URL");
    }

    return result;
  } catch (error) {
    // Подробно логване на грешки
    console.log("Cloudinary upload error:", error.response || error.message || error);
    throw new Error("Error uploading to Cloudinary");
  }
};

// Функция за изтриване на файл от Cloudinary
const deleteMediaFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      throw new Error("Public ID is required for deletion");
    }

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Cloudinary delete error:", error.response || error.message || error);  // Подробно логване на грешки
    throw new Error("Failed to delete asset from Cloudinary");
  }
};

// Експортиране на функциите
module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary };
