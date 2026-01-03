import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const data = [
  { name: "正面情绪", value: 64.2, color: "#65c869" },
  { name: "中性情绪", value: 22.8, color: "#659dc9" },
  { name: "负面情绪", value: 13.0, color: "#f50057" },
];

const SentimentComposition = () => {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={entry.color} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  );
};

export default SentimentComposition;
