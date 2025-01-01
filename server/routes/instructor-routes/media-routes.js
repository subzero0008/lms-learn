const express = require("express");
const multer = require("multer");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// Настройване на multer за качване на файлове
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    
    // Проверка за типа на файла (видео, изображение или PDF)
    const fileType = file.mimetype.split("/")[0]; // "video", "image" или "application"
    let result;

    if (fileType === "video") {
      // Качване на видео
      result = await uploadMediaToCloudinary(file.path, "video");
    } else if (fileType === "image") {
      // Качване на изображение
      result = await uploadMediaToCloudinary(file.path, "image");
    } else if (fileType === "application" && file.mimetype === "application/pdf") {
      // Качване на PDF
      result = await uploadMediaToCloudinary(file.path, "raw");
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file type",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error uploading file" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Asset Id is required",
      });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully from Cloudinary",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({ success: false, message: "Error deleting file" });
  }
});

router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) => {
      const fileType = fileItem.mimetype.split("/")[0]; // "video", "image" или "application"

      if (fileType === "video") {
        return uploadMediaToCloudinary(fileItem.path, "video"); // Качване на видео
      } else if (fileType === "image") {
        return uploadMediaToCloudinary(fileItem.path, "image"); // Качване на изображение
      } else if (fileType === "application" && fileItem.mimetype === "application/pdf") {
        return uploadMediaToCloudinary(fileItem.path, "raw"); // Качване на PDF
      } else {
        return Promise.reject(`Unsupported file type: ${fileItem.originalname}`);
      }
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);

    res.status(500).json({ success: false, message: "Error in bulk uploading files" });
  }
});

module.exports = router;
