// PermissionDeniedPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PermissionDeniedPage.module.css';

const PermissionDeniedPage = () => {
  return (
    <div className={styles.permissionDeniedContainer}>
      <h1 className={styles.heading}>Quyền truy cập bị từ chối</h1>
      <p className={styles.paragraph}>Bạn không có quyền truy cập trang này.</p>
      <p className={styles.paragraph}>Vui lòng liên hệ với quản trị viên để được hỗ trợ.</p>
      <Link to="/" className={styles.homeLink}>
        <button className={styles.homeButton}>Quay lại</button>
      </Link>
    </div>
  );
};

export default PermissionDeniedPage;
