import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();

    player.initialize(videoRef.current, src, true);

    return () => {
      player.reset(); // giải phóng tài nguyên khi component bị xóa
    };
  }, [src]);

  return (
    <video style={{ width: "100%", height: "100%" }} ref={videoRef} controls />
  );
};

export default VideoPlayer;
