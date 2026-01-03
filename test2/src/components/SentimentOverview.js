import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: #222f3e;
  color: white;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  min-width: 250px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CardTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
`;

const CardValue = styled.div`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const CardSubtitle = styled.p`
  font-size: 12px;
  color: #9ca3af;
`;

const SentimentOverview = () => {
  const overviewData = [
    {
      title: "全网舆情总量",
      value: "128,492",
      subtitle: "+12.5% 较昨日同期",
      icon: "💬",
    },
    {
      title: "正面情感占比",
      value: "64.2%",
      subtitle: "+3.1% 较昨日同期",
      icon: "😊",
    },
    {
      title: "严重负面预警",
      value: "12",
      subtitle: "+2 需立即处理",
      icon: "⚠️",
    },
    {
      title: "平均响应时间",
      value: "24.5 min",
      subtitle: "-4.2% 处理效率提升",
      icon: "⏰",
    },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {overviewData.map((item, index) => (
        <Card key={index}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "24px", marginRight: "10px" }}>{item.icon}</span>
            <CardTitle>{item.title}</CardTitle>
          </div>
          <CardValue>{item.value}</CardValue>
          <CardSubtitle>{item.subtitle}</CardSubtitle>
        </Card>
      ))}
    </div>
  );
};

export default SentimentOverview;
