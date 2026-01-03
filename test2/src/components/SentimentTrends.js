import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const SentimentTrends = () => {
  const data = [
    { time: "00:00", positive: 110, neutral: 80, negative: 50 },
    { time: "04:00", positive: 120, neutral: 70, negative: 40 },
    { time: "08:00", positive: 150, neutral: 60, negative: 60 },
    { time: "12:00", positive: 200, neutral: 50, negative: 70 },
    { time: "16:00", positive: 220, neutral: 40, negative: 80 },
    { time: "20:00", positive: 240, neutral: 30, negative: 90 },
    { time: "23:59", positive: 250, neutral: 20, negative: 100 },
  ];

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <LineChart
        width={730}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="positive" stroke="#8884d8" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="neutral" stroke="#82ca9d" />
        <Line type="monotone" dataKey="negative" stroke="#ff7300" />
      </LineChart>
    </div>
  );
};

export default SentimentTrends;
