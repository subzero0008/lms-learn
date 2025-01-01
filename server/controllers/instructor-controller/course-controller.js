const { uploadMediaToCloudinary } = require("../../helpers/cloudinary");
const Course = require("../../models/Course");

const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;
    const fileUrls = [];

    // Ако има PDF файлове в req.files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.split("/")[0];
        if (fileType === "application" && file.mimetype === "application/pdf") {
          const result = await uploadMediaToCloudinary(file.path, "raw");
          fileUrls.push({
            fileName: file.originalname,
            fileUrl: result.secure_url,
            fileType: "pdf",
          });
        }
      }
    }

    // Добавяме ресурсите (PDF файловете) към данните на курса
    courseData.resources = fileUrls;

    const newlyCreatedCourse = new Course(courseData);
    const saveCourse = await newlyCreatedCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course saved successfully",
        data: saveCourse,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getCourseDetailsByID = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDetails = await Course.findById(id);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateCourseByID = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourseData = req.body;
    const fileUrls = [];

    // Ако има PDF файлове в req.files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileType = file.mimetype.split("/")[0];
        if (fileType === "application" && file.mimetype === "application/pdf") {
          const result = await uploadMediaToCloudinary(file.path, "raw");
          fileUrls.push({
            fileName: file.originalname,
            fileUrl: result.secure_url,
            fileType: "pdf",
          });
        }
      }
    }

    // Ако има нови ресурси, добавяме ги към данните на курса
    if (fileUrls.length > 0) {
      updatedCourseData.resources = fileUrls;
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updatedCourseData,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  addNewCourse,
  getAllCourses,
  updateCourseByID,
  getCourseDetailsByID,
};
