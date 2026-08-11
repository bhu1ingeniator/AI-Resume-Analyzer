import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {

const [file,setFile] = useState(null)
const [result,setResult] = useState(null)
const [animatedScore, setAnimatedScore] = useState(0);
useEffect(() => {
  if(result){
    let start = 0;

    const interval = setInterval(() => {
      start += 1;
      setAnimatedScore(start);

      if(start >= result.score){
        clearInterval(interval);
      }

    }, 20);
  }
}, [result]);
const uploadResume = async () => {

const formData = new FormData()
formData.append("resume",file)

const res = await axios.post(
  "https://ai-resume-analyzer-backend-oddf.onrender.com/analyze",
  formData
);

console.log(res.data)
setResult(res.data)

}
const chartData = result
  ? {
      labels: ["Skills Found", "Missing Skills"],
      datasets: [
        {
          data: [result.found.length, result.missing.length],
          backgroundColor: ["#4CAF50", "#ff5252"]
        }
      ]
    }
  : null;
  const downloadReport = () => {

const report = `
AI Resume Analysis Report

Resume Score: ${result.score}%

Skills Found:
${result.found.join(", ")}

Missing Skills:
${result.missing.join(", ")}

Suggestions:
${result.suggestions.join("\n")}
`

const blob = new Blob([report], { type: "text/plain" })

const url = window.URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = "resume_analysis_report.txt"

a.click()

window.URL.revokeObjectURL(url)

}
return (

<div className="container">

<h1> Resume Analyzer</h1>

<div
className="drop-zone"
onDragOver={(e) => e.preventDefault()}
onDrop={(e) => {
  e.preventDefault()
  const droppedFile = e.dataTransfer.files[0]
  setFile(droppedFile)
}}
>

<p>Drag & Drop Resume Here</p>

<p>or</p>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
/>
{file && (
<p>Uploaded: {file.name}</p>
)}
</div>

<button onClick={uploadResume}>
Analyze Resume
</button>

{result && (

<div className="result">

<h2>Resume Score: {result.score}%</h2>
<div className="progress-bar">
  <div
    className="progress"
    style={{ width: animatedScore + "%" }}
  >
    {animatedScore}%
  </div>
</div>
<h3>
{result.score >= 80 ? "Strong Resume 💪" :
 result.score >= 50 ? "Good Resume 👍" :
 "Needs Improvement ⚠️"}
</h3>
{chartData && (
  <div style={{ width: "300px", margin: "20px auto" }}>
    <Pie data={chartData} />
  </div>
)}
<button onClick={downloadReport} className="download-btn">
Download Report
</button>
<h3>Skills Found</h3>

<div>
{result.found.map((s,i)=>(
<span className="skill-badge">{s}</span>
))}
</div>
<h3>Missing Skills</h3>

<div>
{result.missing.map((s,i)=>(
<span className="missing-badge" key={i}>{s}</span>
))}
</div>
{result && result.suggestions && (

<div className="suggestion-box">

<h3>AI Suggestions</h3>

<div>
{result.suggestions.map((s,i)=>(
<span className="suggestion-badge" key={i}>{s}</span>
))}
</div>

</div>

)}
</div>

)}

</div>



)

}

export default App