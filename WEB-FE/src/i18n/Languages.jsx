import { GlobalOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import i18n from "i18next";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  {
    code: "en",
    name: "English",
    country_code: "gb",
  },
  {
    code: "vi",
    name: "Tiếng Việt",
    country_code: "vn",
  },
  {
    code: "zh",
    name: "中文",
    country_code: "cn",
  },
  {
    code: "ja",
    name: "日本語",
    country_code: "jp",
  },
];

const Languages = () => {
  const { t } = useTranslation();

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
  };

  const menu = (
    <Menu>
      {languages.map(({ code, name, country_code }) => (
        <Menu.Item
          key={country_code}
          onClick={() => handleLanguageChange(code)}
        >
          <span className={`flag-icon flag-icon-${country_code}`}></span> {name}
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (
      storedLanguage &&
      languages.find((lang) => lang.code === storedLanguage)
    ) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [languages]);

  return (
    <div style={{ marginLeft: "20px" }}>
      <Dropdown overlay={menu} trigger={["click"]}>
        <span style={{ cursor: "pointer", marginRight: "20px" }}>
          <GlobalOutlined /> {t("language")}
        </span>
      </Dropdown>
    </div>
  );
};

export default Languages;
