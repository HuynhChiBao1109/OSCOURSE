import React from "react";
import styles from "../LearningCourse.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

export const CommentCourse = ({ handleOpenComment, isFullWidth }) => {
  return (
    <div
      className={`${styles.mainComment} ${
        isFullWidth ? "" : styles["main_showTracks"]
      }`}
    >
      <button className={styles.actionBtn_wrapper} onClick={handleOpenComment}>
        <FontAwesomeIcon icon={faComment} />
        <span className={styles.actionBtn_title}>Hỏi đáp</span>
      </button>
    </div>
  );
};
