import React, { useEffect, useState } from "react";
import { ActionBar } from "./ActionBar/ActionBar";
import { ContentWrapper } from "./ContentWrapper/ContentWrapper";
import { SidebarMenu } from "./SidebarMenu/SidebarMenu";
import { CommentCourse } from "./CommentCourse/CommentCourse";
import { VerticalModal } from "./VerticalModal/VerticalModal";

const fakeData = {
  title: "Nội dung khóa học",
  tracks: [
    {
      id: 1,
      title: "Giới thiệu",
      description: "3/3 | 33:15",
      steps: [
        {
          id: 1,
          title: "Giới thiệu dự án O5Course",
          duration: "04:07",
        },
        {
          id: 2,
          title: "Arrow Function",
          duration: "07:07",
        },
        {
          id: 3,
          title: "Create React App",
          duration: "15:07",
        },
      ],
    },
    {
      id: 2,
      title: "Hết giới thiệu",
      description: "3/3 | 33:15",
      steps: [
        {
          id: 4,
          title: "Phần Assignment Screen Ninh m làm ở đây",
          duration: "04:07",
        },
      ],
    },
  ],
};

export const LearningCoursePage = () => {
  const [isFullWidth, setIsFullWidth] = useState(true);
  const [savedState, setSavedState] = useState({});
  const [currentStepId, setCurrentStepId] = useState(null);
  const [currentTrackTitle, setCurrentTrackTitle] = useState(null);

  const [openComment, setOpenComment] = useState(false);

  useEffect(() => {
    const savedStateJSON = localStorage.getItem("sidebarState");
    if (savedStateJSON) {
      const savedState = JSON.parse(savedStateJSON);
      setSavedState(savedState);
    }
  }, []);

  useEffect(() => {
    const savedIsFullWidth = localStorage.getItem("isFullWidth");
    if (savedIsFullWidth) {
      setIsFullWidth(JSON.parse(savedIsFullWidth));
    }
  }, []);

  const handleOpenComment = () => {
    setOpenComment(!openComment);
  };

  const toggleFullWidth = () => {
    const newValue = !isFullWidth;
    setIsFullWidth(newValue);
    saveIsFullWidthToLocalStorage(newValue);
    if (newValue) {
      localStorage.setItem("sidebarState", JSON.stringify(savedState));
    }
  };

  const saveIsFullWidthToLocalStorage = (value) => {
    localStorage.setItem("isFullWidth", JSON.stringify(value));
  };

  const saveSidebarState = (state) => {
    localStorage.setItem("sidebarState", JSON.stringify(state));
    setSavedState(state);
  };

  const handleStepClick = (stepId, trackTitle) => {
    setCurrentStepId(stepId);
    setCurrentTrackTitle(trackTitle);
  };

  useEffect(() => {
    if (savedState && savedState.openTrackIndex === undefined) {
      setCurrentStepId(fakeData.tracks[0].steps[0].id);
      setCurrentTrackTitle(fakeData.tracks[0].title);
    }
  }, [savedState]);

  return (
    <>
      {isFullWidth ? (
        ""
      ) : (
        <SidebarMenu
          savedState={savedState}
          onSaveState={saveSidebarState}
          onStepClick={handleStepClick}
          fakeData={fakeData}
        />
      )}
      <ContentWrapper isFullWidth={isFullWidth} currentStepId={currentStepId} />
      <ActionBar
        toggleFullWidth={toggleFullWidth}
        isFullWidth={isFullWidth}
        currentTrackTitle={currentTrackTitle}
      />
      <CommentCourse
        handleOpenComment={handleOpenComment}
        isFullWidth={isFullWidth}
      />
      <VerticalModal
        handleOpenComment={handleOpenComment}
        openComment={openComment}
      />
    </>
  );
};
