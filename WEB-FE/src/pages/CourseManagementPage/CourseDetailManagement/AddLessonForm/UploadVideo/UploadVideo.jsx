import React, { useState } from "react";
import * as UpChunk from "@mux/upchunk";
import { Image, message, Spin, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { addVideo } from "../../../../../redux/slices/courseSlice";
import { createClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";

const supabaseUrl = "https://supabase.tk2s.org";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q";

const supabase = createClient(supabaseUrl, supabaseKey);

function UploadVideo({ lessonForm }) {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fileUpload, setFileUpload] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const getVideoThumbnail = async (file, seekTo = 1.5) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const videoPlayer = document.createElement("video");
      videoPlayer.setAttribute("src", URL.createObjectURL(file));
      videoPlayer.load();
      videoPlayer.addEventListener("error", (ex) => {
        reject("Lỗi khi tải file video", ex);
      });
      videoPlayer.addEventListener("loadedmetadata", () => {
        if (videoPlayer.duration < seekTo) {
          reject("Video quá ngắn.");
          return;
        }
        setTimeout(() => {
          videoPlayer.currentTime = seekTo;
        }, 200);
        videoPlayer.addEventListener("seeked", () => {
          const canvas = document.createElement("canvas");
          canvas.width = videoPlayer.videoWidth;
          canvas.height = videoPlayer.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
          ctx.canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.75 /* quality */
          );
        });
      });
    });
  };

  const handleUpload = async (file, ctx) => {
    try {
      let _path = ctx.path;
      let _token = ctx.token;
      console.log("_path", _path);
      console.log("_token", _token);
      try {
        const { data, error } = await supabase.storage
          .from("CourseVideos")
          .uploadToSignedUrl(_path, _token, file);
        if (error) {
          throw error;
        }
        console.log("data uploaded", data);
        setIsLoading(false);
        return data;
      } catch (error) {
        setIsLoading(false);
        toast.error("Upload failed!");
        console.log(error);
      }
      // Subscribe to events
      data.on("error", (error) => {
        setStatusMessage(error.detail);
      });

      data.on("progress", (progress) => {
        setProgress(progress.detail);
      });

      data.on("success", () => {
        setStatusMessage("Wrap it up, we're done here. 👋");
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error);
    }
  };

  const beforeUpload = async (file) => {
    setIsLoading(true);
    //call api get signURL
    dispatch(addVideo(lessonForm)).then(async (response) => {
      if (response.error) {
        setIsLoading(false);
        toast.error(response.error.message);
        console.log(response.error);
        return false;
      }
      setFileUpload(file);
      const ctx = response?.payload?.signedUrl;
      console.log("ctx", ctx);

      //upload file
      handleUpload(file, ctx);

      //get thumbnail
      const thumbnailBlob = await getVideoThumbnail(file).catch((error) => {
        toast.error("Failed to generate thumbnail.");
        console.error(error);
      });
      const thumbnailURL = URL.createObjectURL(thumbnailBlob);
      setThumbnail(thumbnailURL);
      setIsLoading(false);
      toast.success("Tải video lên thành công!");
    });
  };

  return (
    <div className="page-container" style={{ position: "relative", zIndex: 0 }}>
      <Upload.Dragger
        previewFile={false}
        maxCount={1}
        showUploadList={false}
        beforeUpload={beforeUpload}
      >
        {!thumbnail && (
          <div>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấp hoặc kéo tệp vào khu vực này để tải lên
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu
              công ty hoặc các tập tin bị cấm khác.
            </p>
          </div>
        )}
        {thumbnail && <Image preview={false} src={thumbnail} />}
      </Upload.Dragger>
      {isLoading && (
        <Spin
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            zIndex: 2,
            textAlign: "center",
            padding: "10% 0",
          }}
        />
      )}
    </div>
  );
}

export default UploadVideo;
