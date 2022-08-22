import { Layout } from "antd";
import React from "react";
import "../styles/customLayout.css";

const { Content } = Layout;

const CustomLayout = ({ children }) => {
  return (
    <Layout className="custom_layout">
      <Content>{children}</Content>
    </Layout>
  );
};

export default CustomLayout;
