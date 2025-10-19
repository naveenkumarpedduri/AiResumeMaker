import { useRef, useState } from 'react'
import './Home.css'

const LoadingSpinner = () => (
  <div className="loading-spinner-container">
    <div className="spinner-wrapper">
      <div className="spinner-circle-1" />
      <div className="spinner-circle-2" />
    </div>
    <div className="loading-text">
      <div className="loading-title">
        Generating your optimized resume...
      </div>
      <div className="loading-subtitle">
        This may take a few moments
      </div>
    </div>
  </div>
)

const Home = () => {
  const resumeRef = useRef(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    applyingAsa: "Fresher",
    coverLetterTone: "Formal",
    jobDescription: "",
    currentResume: ""
  })
  const [generatedResume, setGeneratedResume] = useState("")
  async function handleGenerateData() {
    setIsGenerating(true)
    setGeneratedResume("") // Clear previous resume while generating
    
    console.log("Generating Resume", formData)
    const prompt =
      ` You are a professional career coach and resume optimization expert. 
Your task is to generate a personalized cover letter, improve the resume content, 
and provide an ATS (Applicant Tracking System) analysis.

Inputs:
Company Name: ${formData.companyName}
Experience Level: ${formData.applyingAsa}  (Fresher / Experienced)
Job Description: ${formData.jobDescription}
Current Resume: ${formData.currentResume} (If empty, assume no resume exists and create a draft)
Preferred Tone: ${formData.coverLetterTone}

Output (format clearly in sections):

1. Tailored Cover Letter  
Write a professional cover letter addressed to ${formData.companyName}.  
Use the specified tone: ${formData.coverLetterTone}.  
Highlight relevant skills and experiences based on the job description.  

2. Updated Resume Content  
Suggest optimized resume summary, bullet points, and skills tailored to ${formData.jobDescription}.  
Ensure the content is concise, achievement-focused, and ATS-friendly.  

3. Keyword Match Analysis  
Extract the most important keywords from the job description.  
Check if they exist in the provided resume (if given).  
List missing keywords that should be added.  

4. ATS Score Estimate (0–100)  
Provide a rough ATS match score for the current resume against the job description.  
Explain the reasoning briefly (e.g., missing keywords, formatting issues, irrelevant content).  

Ensure the response is structured, clear, and easy to display in a React app. 
        
`

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-goog-api-key", "[Api Key]");

    const raw = JSON.stringify({
      "contents": [
        {
          "parts": [
            {
              "text": `${prompt}`
            }
          ]
        }
      ]
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", requestOptions);
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(result);
      console.log(text);
      setGeneratedResume(text);
    } catch (error) {
      console.error(error);
      setGeneratedResume("Error generating resume. See console for details.");
    } finally {
      setIsGenerating(false);
    }
   
  }

  function parseSections(text) {
    if (!text) return []
  
    const regex = /^(\d+\.\s*[A-Za-z].*)$/gim
    const matches = [...text.matchAll(regex)]
    if (matches.length === 0) {
   
      return [{ title: null, content: text }]
    }
    const sections = []
    for (let i = 0; i < matches.length; i++) {
      const title = matches[i][1].trim()
      const startIndex = matches[i].index + matches[i][1].length
      const endIndex = i + 1 < matches.length ? matches[i + 1].index : text.length
      const content = text.slice(startIndex, endIndex).trim()
      sections.push({ title, content })
    }
    return sections
  }

  function renderContentAsHtml(content) {
    if (!content) return null
  
    const paragraphs = content.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    return paragraphs.map((p, idx) => (
      <p key={idx} style={{ margin: '0 0 0.75rem' }}>{p.split('\n').map((line, i) => (
        <span key={i}>{line}<br/></span>
      ))}</p>
    ))
  }

  

  function openPrintWindow(htmlContent) {
    const newWindow = window.open('', '_blank', 'width=900,height=700')
    if (!newWindow) {
      alert('Please allow popups to print or download the resume')
      return
    }
    newWindow.document.open()
    newWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Resume</title><style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        padding: 24px;
        color: #2d3748;
        line-height: 1.7;
      }
      h3 {
        background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
        color: #ffffff;
        margin: 0 0 24px 0;
        font-size: 1.6rem;
        font-weight: 800;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        padding: 12px 20px;
        border-radius: 8px;
      }
      .section {
        margin-bottom: 32px;
      }
      .section > div {
        padding: 0 20px;
      }
      p {
        margin: 0 0 12px;
      }
      @media print {
        body {
          padding: 0;
        }
        h3 {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
      </style></head><body>${htmlContent}</body></html>`)
    newWindow.document.close()
    setTimeout(() => {
      newWindow.focus()
      newWindow.print()
    }, 250)
  }

  function handlePrint() {
    if (!generatedResume) { alert('No generated resume to print'); return }
    const html = resumeRef.current?.innerHTML || generatedResume
    openPrintWindow(html)
  }

  function downloadAsWord() {
    if (!generatedResume) { alert('No generated resume to download'); return }
    const html = resumeRef.current?.innerHTML || generatedResume
    const header = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Resume</title></head><body>'
    const footer = '</body></html>'
    const sourceHTML = header + html + footer
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-resume.doc'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function downloadAsTxt() {
    if (!generatedResume) { alert('No generated resume to download'); return }
    const blob = new Blob([generatedResume], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'generated-resume.txt'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function copyToClipboard() {
    if (!generatedResume) { alert('Nothing to copy'); return }
    try {
      await navigator.clipboard.writeText(generatedResume)
      alert('Copied resume text to clipboard')
    } catch (e) {
      alert('Copy failed — please select and copy manually')
    }
  }


  return (
    <div className="main-container">
      <div className="header">
        <h1 className="header-title">AI Resume Builder</h1>
        <p className="header-subtitle">Create a professional, ATS-optimized resume tailored to your target role</p>
      </div>

      <form className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            className="form-input"
            placeholder="Enter the company name"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          />
          <div className="form-hint">
            The company you're applying to
          </div>
        </div>

        <div className="form-row">
          <div className="form-col">
            <label className="form-label" htmlFor="applyingAs">Experience Level</label>
            <select
              id="applyingAs"
              className="form-input"
              value={formData.applyingAsa}
              onChange={(e) => setFormData({ ...formData, applyingAsa: e.target.value })}
            >
              <option value="Fresher">Fresher</option>
              <option value="Experienced">Experienced</option>
            </select>
          </div>

          <div className="form-col">
            <label className="form-label" htmlFor="tone">Cover Letter Tone</label>
            <select
              id="tone"
              className="form-input"
              value={formData.coverLetterTone}
              onChange={(e) => setFormData({ ...formData, coverLetterTone: e.target.value })}
            >
              <option value="Formal">Formal</option>
              <option value="Informal">Informal</option>
              <option value="Casual">Casual</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            className="form-input form-textarea"
            placeholder="Paste the job description here..."
            value={formData.jobDescription}
            onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="currentResume">Current Resume (Optional)</label>
          <textarea
            id="currentResume"
            className="form-input form-textarea"
            placeholder="Paste your current resume content here..."
            value={formData.currentResume}
            onChange={(e) => setFormData({ ...formData, currentResume: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="action-button generate-button"
          onClick={handleGenerateData}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Resume'}
        </button>
      </form>

      <div className="resume-section">
        <h2 className="resume-title">Generated Resume</h2>
        
        <div className="button-group">
          <button type="button" className="action-button" onClick={handlePrint}>
            Print / Save as PDF
          </button>
          <button type="button" className="action-button" onClick={downloadAsWord}>
            Download (.doc)
          </button>
          <button type="button" className="action-button" onClick={downloadAsTxt}>
            Download (.txt)
          </button>
          <button type="button" className="action-button" onClick={copyToClipboard}>
            Copy to Clipboard
          </button>
        </div>

        <div ref={resumeRef} id="generated-resume-preview" className="resume-container">
          {isGenerating ? (
            <LoadingSpinner />
          ) : generatedResume ? (
            (() => {
              const sections = parseSections(generatedResume)
              return sections.map((s, i) => (
                <div key={i} className="section">
                  {s.title ? <h3 className="section-heading">{s.title}</h3> : null}
                  <div className="section-content">{s.content}</div>
                </div>
              ))
            })()
          ) : (
            <div className="empty-resume">No generated resume yet. Click "Generate Resume" to create one.</div>
          )}
        </div>
      </div>
    </div>
  )
}


export default Home
