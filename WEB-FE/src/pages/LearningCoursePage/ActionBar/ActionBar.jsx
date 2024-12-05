import { ArrowRightOutlined } from "@ant-design/icons";
import {
  faAngleLeft,
  faAngleRight,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styles from "../LearningCourse.module.css";

export const ActionBar = ({
  toggleFullWidth,
  isFullWidth,
  currentTrackTitle,
}) => {
  return (
    <div className={styles.actionBar_wrapper}>
      <button className={styles.actionBar_btn}>
        <FontAwesomeIcon icon={faAngleLeft} />
        <span>BÀI TRƯỚC</span>
      </button>
      <button className={`${styles.actionBar_btn} ${styles.actionBar_primary}`}>
        <span>BÀI TIẾP THEO</span> <FontAwesomeIcon icon={faAngleRight} />
      </button>
      <div className={styles.actionBar_toggleWrap}>
        <h3 className={styles.actionBar_trackTitle}>{currentTrackTitle}</h3>
        <button
          className={styles.actionBar_toggleBtn}
          onClick={toggleFullWidth}
        >
          {isFullWidth ? (
            <FontAwesomeIcon icon={faBars} />
          ) : (
            <ArrowRightOutlined />
          )}
        </button>
      </div>
    </div>
  );
};
