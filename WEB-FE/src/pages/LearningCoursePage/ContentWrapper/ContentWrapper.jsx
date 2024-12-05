import React, { useState } from "react";
import ReactPlayer from "react-player";
import styles from "../LearningCourse.module.css";
import { PlusOutlined } from "@ant-design/icons";
import Quiz from "../Quiz/Quiz";
import HttpStreamingPlayer from "./HttpStreamingPlayer/HttpStreamingPlayer";
import VideoPlayer from "./HttpStreamingPlayer/HttpStreamingPlayer";

export const ContentWrapper = ({ isFullWidth, currentStepId }) => {
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const handleProgress = (progress) => {
    setPlayedSeconds(progress.playedSeconds);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const fakeData = [
    {
      id: 1,
      url: "https://www.youtube.com/watch?v=jtYE3B9CnOE",
      title: "Giới thiệu dự án O5Course",
      updated: "tháng 2 năm 2024",
      content:
        "Trong video này chúng ta tìm hiểu về dự án O5Course nhé anh em 😍",
    },
    {
      id: 2,
      url: "https://www.youtube.com/watch?v=530XZyxAjnU",
      title: "Arrow Function",
      updated: "tháng 3 năm 2024",
      content: "Trong video này chúng ta sẽ tìm hiểu về Arrow Function.",
    },
    {
      id: 3,
      url: "https://www.youtube.com/watch?v=ax8BN0TS27c",
      title: "Create React App",
      updated: "tháng 4 năm 2024",
      content: "Hãy cùng nhau tìm hiểu về Create React App.",
    },
  ];

  const currentData = fakeData.find((data) => data.id === currentStepId); // nếu thấy bị mất dữ liệu ở đây thì là bth vì khi reload nó sẽ reset nên sẽ là null nên sẽ đ render được vì undefined, chừng nào có API thì lấy từ url hay j đó thì nó sẽ render ra bth

  console.log("currentData:", currentData);

  const videoSrc = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

  return (
    <div
      className={`${styles["content-wrapper"]} ${
        isFullWidth ? styles["content_full-width"] : ""
      }`}
    >
      {currentData ? (
        <div
          className={`${styles.videoWrapper} ${
            isFullWidth ? styles["video_full-width"] : ""
          }`}
        >
          {/* <ReactPlayer
            url={currentData.url}
            width="100%"
            height="100%"
            controls={true}
            onProgress={handleProgress}
          /> */}
          {/* <HttpStreamingPlayer src="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd" /> */}
          <VideoPlayer src="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd" />
        </div>
      ) : (
        <Quiz />
      )}

      {currentData && (
        <div className={styles.videoContent}>
          <div className={styles.video_contentTop}>
            <header className={styles.wrapper}>
              <h1 className={styles.heading_heading}>{currentData.title}</h1>
              <p className={styles.heading_updated}>
                Cập nhật {currentData.updated}
              </p>
            </header>
            <button className={styles.video_addNote}>
              <PlusOutlined />
              <span className={styles.video_label}>
                Thêm ghi chú tại{" "}
                <span className={styles.video_num}>
                  {formatTime(playedSeconds)}
                </span>
              </span>
            </button>
          </div>
          <div className={styles.markDownParser_wrapper}>
            <p>{currentData.content}</p>
            <hr />
          </div>
        </div>
      )}
    </div>
  );
};
