import React, { useRef, useState } from "react";
import styles from "./SettingProfilePage.module.css";
import { Button, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export const SettingProfilePage = () => {
  // State for managing the editing state of name, bio, email, phone, username, and image
  const [editing, setEditing] = useState({
    name: false,
    bio: false,
    email: false,
    phone: false,
    username: false,
    image: false,
    values: {
      name: "Phạm Đăng Ninh",
      bio: "Ninhhere",
      email: "example@example.com",
      phone: "123-456-7890",
      username: "exampleuser",
      image: null, // Placeholder for image URL
    },
  });

  // Function to handle the "Chỉnh sửa" (Edit) button click
  const handleEdit = (field) => {
    setEditing({ ...editing, [field]: true });
  };

  // Function to handle the "Hủy" (Cancel) button click
  const handleCancel = () => {
    setEditing({
      ...editing,
      name: false,
      bio: false,
      email: false,
      phone: false,
      username: false,
      image: false,
    });
    message.warning("Hủy thay đổi thông tin");
  };

  // Function to handle the "Lưu" (Save) button click
  const handleSave = () => {
    // Perform save operation with editing.values
    console.log("Saving values:", editing.values);
    // Reset editing state
    setEditing({
      ...editing,
      name: false,
      bio: false,
      email: false,
      phone: false,
      username: false,
      image: false,
    });
    message.success("Lưu thông tin thành công");
  };

  // Function to handle the input change
  const handleChange = (e, field) => {
    setEditing({
      ...editing,
      values: {
        ...editing.values,
        [field]: e.target.value,
      },
    });
  };
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageSend, setImageSend] = useState("");

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageSend(file);
      const reader = new FileReader();

      reader.onload = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h2>Cài đặt</h2>
      </div>
      <div className={styles.settingContent}>
        <h4>Thông tin cá nhân</h4>
        {/* Name input */}
        <div className={styles.settingInput}>
          <div>
            <h5>Họ tên</h5>
            {editing.name ? (
              <div>
                <Button onClick={handleSave}>Lưu</Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleEdit("name")}>Chỉnh sửa</Button>
            )}
          </div>
          <Input
            placeholder="Thêm họ tên"
            value={editing.values.name}
            onChange={(e) => handleChange(e, "name")}
            disabled={!editing.name}
          />
          <p>
            Tên của bạn xuất hiện trên trang cá nhân và bên cạnh các bình luận
            của bạn.
          </p>
        </div>
        {/* Bio input */}
        <div className={styles.settingInput}>
          <div>
            <h5>Bio</h5>
            {editing.bio ? (
              <div>
                <Button onClick={handleSave}>Lưu</Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleEdit("bio")}>Chỉnh sửa</Button>
            )}
          </div>
          <Input
            placeholder="Thêm tiểu sử"
            value={editing.values.bio}
            onChange={(e) => handleChange(e, "bio")}
            disabled={!editing.bio}
          />
          <p>
            Bio hiển thị trên trang cá nhân và trong các bài viết (blog) của
            bạn.
          </p>
        </div>
        {/* Image input */}
        <div className={styles.settingInput}>
          <div>
            <h5>Ảnh đại diện</h5>
            <div className={styles.inputImage}>
              {imagePreview ? (
                <img
                  className={styles.imagePreview}
                  src={imagePreview}
                  alt="Image Preview"
                  style={{ width: 100 }}
                  onClick={handleImageClick}
                />
              ) : editing.image ? (
                <img
                  src="https://th.bing.com/th/id/R.d90a006b299492ac099fb038a15c7e55?rik=MbpQJohLOYQCpQ&riu=http%3a%2f%2fwww.clipartbest.com%2fcliparts%2f9i4%2fedX%2f9i4edX7GT.png&ehk=XFTwQUyWNs2AErIJu4V2zfAHUBz12gOgV3IY92SabvE%3d&risl=&pid=ImgRaw&r=0"
                  alt="Camera"
                  style={{ width: 100 }}
                  onClick={handleImageClick}
                />
              ) : (
                <img
                  src="https://th.bing.com/th/id/R.d90a006b299492ac099fb038a15c7e55?rik=MbpQJohLOYQCpQ&riu=http%3a%2f%2fwww.clipartbest.com%2fcliparts%2f9i4%2fedX%2f9i4edX7GT.png&ehk=XFTwQUyWNs2AErIJu4V2zfAHUBz12gOgV3IY92SabvE%3d&risl=&pid=ImgRaw&r=0"
                  alt="Camera"
                  style={{ width: 100, opacity: 0.6 }}
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            {editing.image ? (
              <div>
                <Button onClick={handleSave}>Lưu</Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleEdit("image")}>Chỉnh sửa</Button>
            )}
          </div>
          {/* Display uploaded image */}
          <p>Ảnh đại diện của bạn.</p>
        </div>
        {/* Email input */}
        <div className={styles.settingInput}>
          <div>
            <h5>Email</h5>
            {editing.email ? (
              <div>
                <Button onClick={handleSave}>Lưu</Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleEdit("email")}>Chỉnh sửa</Button>
            )}
          </div>
          <Input
            placeholder="Thêm email"
            value={editing.values.email}
            onChange={(e) => handleChange(e, "email")}
            disabled={!editing.email}
          />
          <p>
            Email của bạn sẽ được sử dụng để đăng nhập và nhận thông báo từ hệ
            thống.
          </p>
        </div>
        {/* Phone input */}
        <div className={styles.settingInput}>
          <div>
            <h5>Số điện thoại</h5>
            {editing.phone ? (
              <div>
                <Button onClick={handleSave}>Lưu</Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleEdit("phone")}>Chỉnh sửa</Button>
            )}
          </div>
          <Input
            placeholder="Thêm số điện thoại"
            value={editing.values.phone}
            onChange={(e) => handleChange(e, "phone")}
            disabled={!editing.phone}
          />
          <p>
            Số điện thoại của bạn sẽ được sử dụng để liên lạc và nhận thông báo.
          </p>
        </div>
        {/* Username input */}
        <div className={styles.settingInput}>
          <div>
            <h5>Username</h5>
            {editing.username ? (
              <div>
                <Button onClick={handleSave}>Lưu</Button>
                <Button style={{ marginLeft: 10 }} onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            ) : (
              <Button onClick={() => handleEdit("username")}>Chỉnh sửa</Button>
            )}
          </div>
          <Input
            placeholder="Thêm tên người dùng"
            value={editing.values.username}
            onChange={(e) => handleChange(e, "username")}
            disabled={!editing.username}
          />
          <p>
            Username của bạn sẽ được sử dụng để đăng nhập và hiển thị trên trang
            cá nhân.
          </p>
        </div>
      </div>
    </div>
  );
};
