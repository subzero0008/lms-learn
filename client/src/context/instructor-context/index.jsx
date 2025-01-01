import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState(false);
  const [pdfUploadProgressPercentage, setPdfUploadProgressPercentage] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  // Добавени методи за успех и грешка при качване
  const handleFileUploadSuccess = (file) => {
    // Може да извършиш някаква логика тук
  };

  const handleFileUploadFailure = (error) => {
    setUploadError(error); // Записваме грешката в състоянието
  };

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
        pdfUploadProgress,
        setPdfUploadProgress,
        pdfUploadProgressPercentage,
        setPdfUploadProgressPercentage,
        uploadError, // Предоставяме състоянието за грешка
        handleFileUploadSuccess, // Функция за успех
        handleFileUploadFailure, // Функция за неуспех
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
