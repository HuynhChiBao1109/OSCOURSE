import {
  faAngleDown,
  faAngleUp,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Drawer,
  Dropdown,
  Menu,
  Modal,
  Spin,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Link, useParams } from "react-router-dom";
import styles from "../LearningCourse.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetListComment,
  postCommentInCourse,
  removeCommentInCourse,
} from "../../../redux/slices/courseSlice";
import {
  getCommentByCourseSelector,
  getLoadingSelector,
  getUserLoginSelector,
} from "../../../redux/selectors";
import { DeleteFilled, EditFilled, EllipsisOutlined } from "@ant-design/icons";

export const VerticalModal = ({ openComment, handleOpenComment }) => {
  const fakeData = {
    imageURL:
      "https://thuthuatnhanh.com/wp-content/uploads/2018/07/anh-dai-dien-dep.jpg",
    comments: [
      {
        id: 1,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
        replyComment: [
          {
            avatarReply:
              "https://o.vdoc.vn/data/image/2022/08/25/avatar-cute-cho-co-nang-nghien-tra-sua.jpg",
            user: "user1",
            username: "username1",
            comment: "This is a comment.",
            dateComment: "2024-03-09",
          },
        ],
      },
      {
        id: 2,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user2",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 3,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 4,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 5,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 6,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 7,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 8,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 9,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
      {
        id: 10,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeMDKbB1z_3RjaG4elUPjtTa-zd9OFxSpaA&usqp=CAU",
        user: "user1",
        username: "username1",
        comment: "This is a comment.",
        dateComment: "2024-03-09",
        numReplier: 3,
      },
    ],
  };

  const dispatch = useDispatch();
  const { courseId } = useParams();

  const user = useSelector(getUserLoginSelector);
  const commentList = useSelector(getCommentByCourseSelector);
  const isLoading = useSelector(getLoadingSelector);

  console.log("user", user);
  console.log("commentList", commentList);

  const [comments, setComments] = useState(false);
  const [loading, setLoading] = useState(isLoading);
  const [changeInput, setChangeInput] = useState(false);
  const [editor, setEditor] = useState("");
  const [openReplies, setOpenReplies] = useState({});
  const [openReplyCmt, setOpenReplyCmt] = useState(false);
  const [reversedComments, setReversedComments] = useState([]);

  useEffect(() => {
    dispatch(fetchGetListComment(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    if (commentList) {
      setComments(commentList);
    } else {
      <Spin />;
    }
  }, [commentList]);

  useEffect(() => {
    if (comments) {
      const reversed = [...comments].reverse();
      setReversedComments(reversed);
    }
  }, [comments]);

  const handleChangeInput = () => {
    setChangeInput(!changeInput);
  };

  const handleEditorChange = (content) => {
    setEditor(content);
  };

  const handleCommentSubmit = () => {
    const newData = {
      description: editor,
      course_id: courseId,
      user_id: user.id,
      parent_comment: courseId,
    };
    dispatch(postCommentInCourse(newData));
    setEditor("");
  };

  const handleOpenReply = () => {
    setOpenReplyCmt(!openReplyCmt);
  };
  const handleReply = (commentId) => {
    setOpenReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleCloseReply = (commentId) => {
    setOpenReplies((prevState) => {
      const updatedReplies = { ...prevState };
      delete updatedReplies[commentId];
      return updatedReplies;
    });
  };

  const handleDeleteComment = (id) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa comment này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        dispatch(removeCommentInCourse(id));
        message.success("Đã xóa comment thành công");
      },
    });
  };

  return (
    <>
      {openComment && (
        <Drawer
          open={openComment}
          onClose={handleOpenComment}
          placement="right"
          width={800}
        >
          <div className={styles.comment_contentHeading}>
            <div>
              <p className={styles.commentHelp}>
                (Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé)
              </p>
            </div>
          </div>
          <div className={styles.commentBox_commentWrapper}>
            <div className={styles.commentBox_avatarWrapper}>
              <div className={styles.fallBackAvatar_avatar}>
                <img className={styles.commentBox_myAvatar} src={user.avatar} />
              </div>
            </div>
            <div className={styles.commentBox_commentContent}>
              {changeInput ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className={styles.editor}>
                      <textarea
                        placeholder="Bạn có thắc mắc gì trong bài học này?"
                        value={editor}
                        onChange={(e) => handleEditorChange(e.target.value)}
                      />
                    </div>
                    <div className={styles.commentBox_actionWrapper}>
                      <Button
                        className={styles.commentBox_cancel}
                        onClick={handleChangeInput}
                        danger
                      >
                        Hủy
                      </Button>
                      <Button
                        className={styles.commentBox_ok}
                        onClick={handleCommentSubmit}
                        disabled={!editor}
                      >
                        Bình luận
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={styles.commentBox_placeholder}
                    style={{ cursor: "pointer" }}
                    onClick={handleChangeInput}
                  >
                    <span>Bạn có thắc mắc gì trong bài học này?</span>
                  </div>
                </>
              )}
            </div>
          </div>
          {reversedComments &&
            reversedComments.map((item, index) => (
              <>
                <div key={index} className={styles.comment_detailComment}>
                  <div className={styles.comment_avatarWrap}>
                    <Link to={`/${item.username}`}>
                      <div className={styles.comment_avatarWrapper}>
                        <div className={styles.fallBackAvatar_avatar}>
                          <img
                            className={styles.commentBox_myAvatar}
                            src={item.user && item.user.avatar}
                          />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className={styles.comment_commentBody}>
                    <div className={styles.comment_commentInner}>
                      <div className={styles.comment_commentWrapper}>
                        <div style={{ display: "flex" }}>
                          <div className={styles.comment_commentContent}>
                            <div className={styles.comment_commentHeading}>
                              <Link>
                                <span>{item.user && item.user.name}</span>
                              </Link>
                            </div>
                            <div className={styles.comment_commentText}>
                              <div className={styles.markdownParser_wrapper}>
                                <p>{item.description}</p>
                              </div>
                            </div>
                          </div>
                          <Dropdown
                            overlay={
                              <Menu>
                                <Menu.Item
                                  key="edit"
                                  // onClick={() => handleEdit(id)}
                                >
                                  <Tooltip title={"Sửa"}>
                                    <EditFilled />
                                  </Tooltip>
                                </Menu.Item>
                                <Menu.Item
                                  key="delete"
                                  onClick={() => handleDeleteComment(item.id)}
                                >
                                  <Tooltip title={"Xóa"}>
                                    <DeleteFilled />
                                  </Tooltip>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <Button className={styles.replyComment}>
                              <EllipsisOutlined />
                            </Button>
                          </Dropdown>
                        </div>
                        <div className={styles.comment_commentTime}>
                          <div className={styles.comment_createAt}>
                            <div className={styles.createdAtLeft}>
                              <span className={styles.comment_time}></span>
                            </div>
                            <div className={styles.createdAtRight}>
                              <div
                                className={styles.replyComment}
                                onClick={() => handleReply(item.id)}
                              >
                                <span>Trả lời</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {openReplies[item.id] && (
                      <div className={styles.replyBox_replyWrapper}>
                        <div className={styles.replyBox_replyContent}>
                          <div className={styles.replyBox_avatarWrapper}>
                            <div className={styles.fallBackAvatar_avatar}>
                              <img
                                className={styles.commentBox_myAvatar}
                                src={user.avatar}
                              />
                            </div>
                          </div>
                          <div className={styles.editor}>
                            <textarea placeholder="@Ai đó" />
                          </div>
                        </div>
                        <div className={styles.replyBox_actionWrapper}>
                          <Button
                            className={styles.replyBox_cancel}
                            onClick={() => handleCloseReply(item.id)}
                            danger
                            style={{ marginRight: 10 }}
                          >
                            Hủy
                          </Button>
                          <Button
                            className={styles.replyBox_ok}
                            onClick={handleCommentSubmit}
                          >
                            Bình luận
                          </Button>
                        </div>
                      </div>
                    )}
                    {openReplyCmt &&
                      item.replyComment &&
                      item.replyComment.map((reply, replyIndex) => (
                        <div
                          key={replyIndex}
                          className={styles.comment_replyWrap}
                        >
                          <div className={styles.comment_viewRepliesMore}>
                            <span>
                              <span
                                className={styles.comment_showHideComment}
                                onClick={handleOpenReply}
                              >
                                Ẩn câu trả lời
                              </span>
                              <FontAwesomeIcon
                                icon={faAngleUp}
                                className={styles.comment_icon}
                              />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                {openReplyCmt &&
                  item.replyComment &&
                  item.replyComment.map((reply, replyIndex) => (
                    <div key={replyIndex} className={styles.comment_replyWrap}>
                      <div
                        className={`${styles.comment_detailComment} ${styles.comment_replyCommentWrap}`}
                      >
                        <div className={styles.comment_avatarWrap}>
                          <Link to={`/${reply.username}`}>
                            <div className={styles.comment_avatarWrapper}>
                              <div className={styles.fallBackAvatar_avatar}>
                                <img
                                  className={styles.commentBox_myAvatar}
                                  src={reply.avatarReply}
                                />
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className={styles.comment_commentBody}>
                          <div className={styles.comment_commentInner}>
                            <div className={styles.comment_commentWrapper}>
                              <div className={styles.comment_commentContent}>
                                <div className={styles.comment_commentHeading}>
                                  <Link to={`/${reply.username}`}>
                                    <span>{reply.user}</span>
                                  </Link>
                                </div>
                                <div className={styles.comment_commentText}>
                                  <div
                                    className={styles.markdownParser_wrapper}
                                  >
                                    <p>{reply.comment}</p>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.comment_commentTime}>
                                <div className={styles.comment_createAt}>
                                  <div className={styles.createdAtLeft}>
                                    <span className={styles.comment_time}>
                                      {reply.dateComment}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {!openReplyCmt && item.replyComment && (
                  <div
                    className={`${styles.comment_viewRepliesMore} ${styles.comment_inContainer}`}
                  >
                    <span
                      className={styles.comment_showHideComment}
                      onClick={handleOpenReply}
                    >
                      Xem {item.numReplier} câu trả lời{" "}
                    </span>
                    <FontAwesomeIcon
                      icon={faAngleDown}
                      className={styles.comment_icon}
                    />
                  </div>
                )}
              </>
            ))}
        </Drawer>
      )}
    </>
  );
};
