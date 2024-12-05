import React from "react";
import styles from "./MyCertificatePage.module.css";
import { Link } from "react-router-dom";
import { Button } from "antd";
import jsPDF from "jspdf";
import { imageExporter } from "../../assets/images";

const fakeCertificates = [
  {
    id: 1,
    title: "Project Management Principles and Practices",
    institution: "University of California, Irvine",
    imageUrl: "/cert-specialization.png",
  },
  {
    id: 2,
    title: "Project Management Principles and Practices",
    institution: "University of California, Irvine",
    imageUrl: "/cert-specialization.png",
  },
  {
    id: 3,
    title: "Project Management Principles and Practices",
    institution: "University of California, Irvine",
    imageUrl: "/cert-specialization.png",
  },
  {
    id: 4,
    title: "Project Management Principles and Practices",
    institution: "University of California, Irvine",
    imageUrl: "/cert-specialization.png",
  },
  {
    id: 5,
    title: "Project Management Principles and Practices",
    institution: "University of California, Irvine",
    imageUrl: "/cert-specialization.png",
  },
  {
    id: 6,
    title: "Project Management Principles and Practices",
    institution: "University of California, Irvine",
    imageUrl: "/cert-specialization.png",
  },
];

const generatePDF = () => {
  // Tạo một đối tượng jsPDF
  const doc = new jsPDF();

  // Thiết lập thông số của logo
  const logoWidth = 50;
  const logoHeight = 50;
  const logoMargin = 10;

  // Thêm logo vào tệp PDF
  const logoX = logoMargin;
  const logoY = logoMargin;
  doc.addImage(imageExporter.logo, "PNG", logoX, logoY, logoWidth, logoHeight);

  // Thiết lập font chữ và kích thước cho tiêu đề
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);

  // Thiết lập thông số của nội dung
  const contentX = logoX + logoWidth + logoMargin;
  const contentY = logoY + logoHeight / 2;
  const contentWidth = doc.internal.pageSize.getWidth() - contentX - logoMargin;
  const lineHeight = 10;

  // Thêm tiêu đề vào tệp PDF
  doc.text("Certificate of Completion", contentX, contentY, { align: "left" });

  // Thiết lập font chữ và kích thước cho nội dung chính
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);

  // Thêm nội dung chính vào tệp PDF
  const text = [
    "This is to certify that Ninh Dang Pham",
    "has successfully completed the course: Node JS",
  ];
  text.forEach((line, i) => {
    doc.text(line, contentX, contentY + lineHeight * (i + 1));
  });

  // Thiết lập font chữ và kích thước cho phần chữ ký và ngày
  doc.setFontSize(12);
  doc.setTextColor(128, 128, 128);

  // Thêm chữ ký và ngày vào tệp PDF
  doc.text("Authorized Signature", contentX, contentY + lineHeight * 4, {
    align: "left",
  });
  doc.text(
    "Date: " + new Date().toLocaleDateString(),
    contentX,
    contentY + lineHeight * 5,
    {
      align: "left",
    }
  );

  // Lưu tệp PDF
  doc.save("Certificate.pdf");
};
export const MyCertificatePage = () => {
  return (
    <div className={styles.accomplishmentAdapter}>
      <div className={styles.accomplishments}>
        <div className={styles.accomplishmentWrapper}>
          <div>
            <div className={styles.pagination_section}>
              <div className={styles.certificateList}>
                <h2
                  className={`${styles["section-title"]} ${styles["headline-3-text"]}`}
                >
                  Chứng chỉ của tôi
                </h2>
                {fakeCertificates.map((certificate) => (
                  <div
                    key={certificate.id}
                    className={`${styles.accomplishmentCard} ${styles["card-rich-interact"]}`}
                  >
                    <div className={styles["horizontal-box"]}>
                      <div className={styles["vertical-box"]}>
                        <Link>
                          <img
                            style={{ maxHeight: "72px" }}
                            src={certificate.imageUrl}
                            alt={`Certificate for ${certificate.title}`}
                          />
                        </Link>
                      </div>
                      <div
                        className={`${styles["card-content"]} ${styles["flex-1"]}`}
                      >
                        <Link>
                          <h3 className={styles["headline-1-text"]}>
                            {certificate.title}
                          </h3>
                        </Link>
                        <div className={styles["caption-text"]}>
                          {certificate.institution}
                        </div>
                        <div className={styles["bottom-row"]}></div>
                      </div>
                      <div className={styles.btnView}>
                        <Button onClick={generatePDF}>
                        Tải xuống chứng chỉ
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.pagination_section}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
