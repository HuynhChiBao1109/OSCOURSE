import React, { useState, useEffect } from "react";
import styles from "../LearningCourse.module.css";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePause, faCirclePlay } from "@fortawesome/free-solid-svg-icons";

export const SidebarMenu = ({
  savedState,
  onSaveState,
  onStepClick,
  fakeData,
}) => {
  const [openTrackIndex, setOpenTrackIndex] = useState(
    savedState?.openTrackIndex ?? null
  );
  const [openStepId, setOpenStepId] = useState(savedState?.openStepId ?? null);

  const handleTrackClick = (index) => {
    setOpenTrackIndex(openTrackIndex === index ? null : index);
    onSaveState({
      openTrackIndex: openTrackIndex === index ? null : index,
      openStepId,
      currentTrackTitle: fakeData.tracks[index].title,
    });
  };

  const handleStepClick = (id) => {
    setOpenStepId(openStepId === id ? null : id);
    onSaveState({ openTrackIndex, openStepId: openStepId === id ? null : id });
    onStepClick(id, fakeData.tracks[openTrackIndex]?.title);
  };

  useEffect(() => {
    if (savedState && savedState.openTrackIndex !== undefined) {
      setOpenTrackIndex(savedState.openTrackIndex);
    }
    if (savedState && savedState.openStepId !== undefined) {
      setOpenStepId(savedState.openStepId);
    }
  }, [savedState]);

  return (
    <>
      <div className={styles.tracks_wrapper}>
        <div className={styles.tracks_container}>
          <header className={styles.tracks_header}>
            <h1 className={styles.tracks_heading}>{fakeData.title}</h1>
          </header>
          <div className={styles.tracks_body}>
            {fakeData.tracks.map((track, index) => (
              <div key={track.id}>
                <div
                  className={styles.trackItem_wrapper}
                  onClick={() => handleTrackClick(index)}
                >
                  <h3 className={styles.trackItem_title}>{track.title}</h3>
                  <span className={styles.trackItem_desc}>
                    {track.description}
                  </span>
                  <span className={styles.trackItem_icon}>
                    {openTrackIndex === index ? (
                      <UpOutlined />
                    ) : (
                      <DownOutlined />
                    )}
                  </span>
                </div>
                <div
                  className={`${styles["trackItem_track-steps-list"]} ${
                    openTrackIndex === index ? styles["trackItem_opened"] : ""
                  }`}
                >
                  {track.steps.map((step) => (
                    <div
                      key={step.id}
                      className={`${styles.stepItem_wrapper} ${
                        openStepId === step.id ? styles.stepItem_active : ""
                      }`}
                      onClick={() => handleStepClick(step.id)}
                    >
                      <div className={styles.stepItem_info}>
                        <h3 className={styles.stepItem_title}>{step.title}</h3>
                        <p className={styles.stepItem_decs}>
                          {openStepId === step.id ? (
                            <FontAwesomeIcon icon={faCirclePause} />
                          ) : (
                            <FontAwesomeIcon icon={faCirclePlay} />
                          )}
                          <span style={{ marginLeft: "10px" }}>
                            {step.duration}
                          </span>
                        </p>
                      </div>
                      <div className={styles["stepItem_icon-box"]}></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.tracks_overlay}></div>
    </>
  );
};
