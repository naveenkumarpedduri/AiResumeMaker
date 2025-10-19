# AI Resume Builder

An intelligent resume builder that leverages AI to create professional, ATS-optimized resumes tailored to specific job descriptions. Built with React and powered by Google's Gemini AI, this tool helps job seekers create compelling resumes and cover letters optimized for Applicant Tracking Systems (ATS).


## Features

- **AI-Powered Resume Generation**: Utilizes Gemini AI to analyze job descriptions and create tailored content
- **ATS Optimization**: Ensures resumes are optimized for Applicant Tracking Systems
- **Multiple Export Options**:
  - Print/Save as PDF
  - Download as Word Document (.doc)
  - Download as Text File (.txt)
  - Copy to Clipboard
- **Real-time Generation**: Watch as your resume is created with a sleek loading animation
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional Formatting**: Clean, modern design with proper section organization

## Key Components

1. **Cover Letter Generation**
   - Professional cover letters tailored to the company
   - Customizable tone (Formal/Informal/Casual)
   - Company-specific content adaptation

2. **Resume Content Optimization**
   - Optimized resume summary
   - Achievement-focused bullet points
   - Skills tailored to job requirements

3. **ATS Analysis**
   - Keyword matching with job description
   - Missing keywords identification
   - ATS compatibility score

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ai-resume-builder
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Create a .env file and add your Gemini AI API key:
\`\`\`env
VITE_GEMINI_API_KEY=your_api_key_here
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

## Usage

1. Enter the company name and select your experience level
2. Choose your preferred cover letter tone
3. Paste the job description
4. (Optional) Paste your current resume for optimization
5. Click "Generate Resume" and wait for the AI to work its magic
6. Use the export options to download or print your optimized resume

## Built With

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Gemini AI API](https://ai.google.dev/) - AI language model
- CSS Modules - Styling

## Future Enhancements

- [ ] Multiple resume templates
- [ ] Rich text editor for manual adjustments
- [ ] Save resumes to local storage
- [ ] Multiple language support
- [ ] LinkedIn profile integration
- [ ] More export formats (PDF, LaTeX)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google's Gemini AI for powerful language processing
- React community for excellent tools and libraries
- All contributors and users of this project

## Support

For support, email <your-email> or open an issue in the repository.
