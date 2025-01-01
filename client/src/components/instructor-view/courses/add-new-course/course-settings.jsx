import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  // Универсална функция за качване на медии
  async function handleMediaUploadChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          formData,
          setMediaUploadProgressPercentage
        );

        if (response.success) {
          const fileType = selectedFile.type.split("/")[0]; // Разделяме типa на файла

          // Възможни типове файлове: "image", "video", "application"
          if (fileType === "image") {
            setCourseLandingFormData({
              ...courseLandingFormData,
              image: response.data.url,
            });
          } else if (fileType === "video") {
            setCourseLandingFormData({
              ...courseLandingFormData,
              videoUrl: response.data.url,
            });
          } else if (selectedFile.type === "application/pdf") {
            setCourseLandingFormData({
              ...courseLandingFormData,
              pdfUrl: response.data.url,
            });
          }

          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
        setMediaUploadProgress(false); // В случай на грешка
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {/* Покажи текущото изображение, видео или PDF ако има */}
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : courseLandingFormData?.videoUrl ? (
          <video src={courseLandingFormData.videoUrl} controls />
        ) : courseLandingFormData?.pdfUrl ? (
          <iframe src={courseLandingFormData.pdfUrl} width="100%" height="600px" />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Media</Label>
            <Input
              onChange={handleMediaUploadChange}
              type="file"
              accept="image/*,video/*,application/pdf"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
