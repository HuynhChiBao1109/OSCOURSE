import React, { useState } from "react";
import styles from "./CommentBlog.module.css";
import { UserOutlined, LikeOutlined, MessageOutlined, DeleteOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Input, Modal, message } from "antd";

export const CommentBlog = () => {
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const [replyContent, setReplyContent] = useState(""); // State for reply input content
  const [replyingCommentIndex, setReplyingCommentIndex] = useState(null); // State to track which comment is being replied to

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      const newComment = {
        id: commentList.length + 1, // Assign unique ID for each comment
        author: "User",
        avatar: <Avatar icon={<UserOutlined />} />,
        content: comment,
        datetime: new Date(),
        replies: [], // Initialize replies array
      };

      setCommentList([...commentList, newComment]);
      setComment("");
      message.info("Bình luận thành công!");
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  const handleLike = (commentIndex) => {
    // Handle the "Like" button click for the specific comment
    console.log(`Liked comment by ${commentList[commentIndex].author}`);
  };

  const handleCommentReply = (commentIndex) => {
    setReplyingCommentIndex(commentIndex);
    setReplyContent("");
  };

  const handleReplySubmit = () => {
    // Add the reply to the corresponding comment
    if (replyContent.trim() !== "") {
      const newReply = {
        author: "User",
        content: replyContent,
        datetime: new Date(),
      };
      const updatedCommentList = [...commentList];
      updatedCommentList[replyingCommentIndex].replies.push(newReply);
      setCommentList(updatedCommentList);
      setReplyingCommentIndex(null); // Reset replying comment index
      setReplyContent(""); // Clear reply content
    }
  };

  const handleDeleteComment = (commentIndex) => {
    // Hiển thị modal xác nhận
    Modal.confirm({
      title: "Xác nhận xóa bình luận",
      content: "Bạn có chắc chắn muốn xóa bình luận này?",
      onOk: () => {
        const updatedCommentList = [...commentList];
        updatedCommentList.splice(commentIndex, 1);
        setCommentList(updatedCommentList);
        message.success("Bình luận đã được xóa!");
      },
    });
  };

  const handleDeleteReplyComment = (replyIndex, commentIndex) => {
    const comment = commentList[commentIndex];
  
    // Display confirmation modal
    Modal.confirm({
      title: "Xác nhận xóa bình luận",
      content: "Bạn có chắc chắn muốn xóa bình luận này?",
      onOk: () => {
        // **Deletion logic:**
        const updatedCommentList = [...commentList];
        updatedCommentList[commentIndex].replies.splice(replyIndex, 1);
        setCommentList(updatedCommentList);
  
        // Display success message
        message.success("Bình luận đã được xóa!");
      },
    });
  };

  return (
    <div>
      <p>(Nếu thấy bình luận spam, các bạn bấm report giúp admin nhé)</p>
      <div className={styles.commentInput}>
        <Avatar size="large" icon={<UserOutlined />} />
        <Input
          small
          placeholder="Viết bình luận của bạn..."
          value={comment}
          onChange={handleCommentChange}
        />
      </div>
      <div className={styles.commentBtn}>
        <Button onClick={() => setComment("")}>Hủy</Button>
        <Button type="primary" onClick={handleAddComment}>
          Bình luận
        </Button>
      </div>
      {showAlert && (
        <Alert
          message="Vui lòng nhập nội dung bình luận!"
          type="error"
          showIcon
          closable
          style={{ marginTop: 16 }}
        />
      )}
      <div className={styles.commentList}>
        {commentList.map((item, index) => (
          <div key={item.id} className={styles.commentItem}>
            <div className={styles.commentMeta}>
              <Avatar icon={<UserOutlined />} />
              <div>
                <h3>{item.author}</h3>
                <p>{item.content}</p>
              </div>
            </div>
            <div className={styles.itemActions}>
              <Button
                type="link"
                icon={<LikeOutlined />}
                onClick={() => handleLike(index)}
              >
                Thích
              </Button>
              <Button
                icon={<MessageOutlined />}
                onClick={() => handleCommentReply(index)}
                type="link"
              >
                Trả lời
              </Button>
              <Button 
                type="link" 
                icon={<DeleteOutlined />} 
                danger onClick={() => handleDeleteComment(index)}>
                Xóa bình luận
              </Button>
            </div>
            {replyingCommentIndex === index && (
              <div className={styles.replyInput}>
                <div>
                  <Avatar size="small" icon={<UserOutlined />} />
                  <Input
                    placeholder="Nhập phản hồi của bạn..."
                    value={replyContent}
                    onChange={handleReplyChange}
                  />
                </div>
                <div>
                  <Button onClick={() => setReplyingCommentIndex(null)}>
                    Hủy
                  </Button>
                  <Button type="primary" onClick={handleReplySubmit}>
                    Trả lời
                  </Button>
                  
                </div>
              </div>
            )}
            {item.replies && (
              <div className={styles.replies}>
                {item.replies.map((reply, replyIndex) => (
                  <>
                    <div key={replyIndex} className={styles.commentMetaReply}>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <h3>{item.author}</h3>
                        <p>{item.content}</p>
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <Button
                        type="link"
                        icon={<LikeOutlined />}
                        onClick={() => handleLike(index)}
                      >
                        Thích
                      </Button>
                      <Button
                        icon={<MessageOutlined />}
                        onClick={() => handleCommentReply(index)}
                        type="link"
                      >
                        Trả lời
                      </Button>
                      <Button
                        type="link"
                        icon={<DeleteOutlined />}
                        danger onClick={() => handleDeleteReplyComment(replyIndex, index)}
                      >
                      Xóa bình luận
                      </Button>
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
