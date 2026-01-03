import React from "react";
import "./App.css";
import SentimentOverview from "./components/SentimentOverview";
import SentimentTrends from "./components/SentimentTrends";
import SentimentComposition from "./components/SentimentComposition";

function App() {
  return (
    <div className="App">
      <header>
        <h1>舆情情感实时监测系统</h1>
        <p>更新时间：2025年12月29日 14:30:05</p>
      </header>
      <main>
        <SentimentOverview />
        <SentimentTrends />
        <SentimentComposition />
      </main>
    </div>
  );
}

export default App;
