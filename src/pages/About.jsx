import React from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    navigate('/feedback');
  };

  return (
    <div className="about-container">
  <div className="about-box">
    <h1>Personality Analysis by Mobile App Usage</h1>
    <p>
      <em><strong>Personality Analysis by Mobile App Usage</strong></em> is an innovative web application designed to bridge the gap between traditional psychological assessment and modern digital behavior. This project harnesses users’ interactions with their mobile devices to provide deep insights into their personality traits, utilizing well-established frameworks such as the Myers-Briggs Type Indicator (MBTI) and the Big Five (OCEAN) model.
    </p>
  </div>

  <div className="about-box">
    <h2>Project Concept</h2>
    <p>IInstead of relying solely on generic and context-free questions, this application dives into the patterns of mobile app usage to unearth aspects of a user’s character. By <strong>analyzing which types of apps are most frequently used</strong>—whether it's social media, productivity, entertainment, or finance—the system reveals <strong>behavioral trends</strong> that align with key personality traits.</p>
  </div>

  <div className="about-box">
    <h2>How It Works</h2>
    <h3>1. User Interaction & Authentication:</h3>
    <p>
          The journey begins with a secure signup and login process. This ensures that users’ results and quiz histories are stored and can be tracked over time.
    </p>
    <h3>2. Customized Quiz Experience</h3>
    <ul>
          <li>
            <strong>📱 Mobile App Usage Data:</strong> The quiz is structured around questions that are directly related to everyday mobile app behaviors.
          </li>
          <li>
            <strong>🧠 Dual Personality Assessment:</strong> The quiz is divided into:
            <ul>
              <li><strong>MBTI Assessment:</strong> Determines your type among 16 personalities.</li>
              <li><strong>Big Five Analysis:</strong> Scores openness, conscientiousness, extraversion, agreeableness, and neuroticism.</li>
            </ul>
          </li>
    </ul>
    <h3>3. Data Visualization & Reporting</h3>
    <p>Results include:</p>
    <ul>
      <li><strong>📊 Visual Charts:</strong> Interactive charts to visualize personality traits.</li>
      <li><strong>🌍 Global Trait Comparison:</strong> Compare your traits with global averages.</li>
      <li><strong>📄 Downloadable PDF Reports:</strong> Comprehensive reports available for download.</li>
   </ul>
  </div>

  <div className="about-box">
    <h2>Technology and Features</h2>
    <ul>
          <li><strong>⚛️ Frontend:</strong> React + Vite</li>
          <li><strong>🎨 Styling:</strong>  @tailwind CSS</li>
          <li><strong>🔀 Routing & State:</strong> React Router + Context API</li>
          <li><strong>📊 Visualization:</strong> Chart.js or Recharts</li>
          <li><strong>🧩 Advanced Features:</strong> PDF export, sharing results , Download the results </li>
    </ul>
  </div>

  <div className="about-box">
    <h2>The Value Proposition</h2>
    <p>
          This tool contextualizes psychological analysis within everyday mobile habits, offering a dynamic, relevant, and modern self-discovery experience. Whether for personal growth, research, or behavioral insights, it brings a fresh, interactive approach to personality testing.
        </p>
        <p><strong>Note:</strong> This is a conceptual overview. Implementation is in progress.</p>

  </div>

  <div className="about-box">
    <h2>Meet the Team</h2>
    <ul className="team-list">
          <li><strong>👤Tripti Tiwari</strong> – Project Lead & UI/UX Designer </li>
          <li><strong>👤 Himanshu Kumar</strong> – Full Stack Developer</li>
          <li><strong>👤 Rahul Reyon</strong> – Data Analyst & Visualization Specialist</li>
          <li><strong>👤 Sandeep Kumar</strong> – Research & Quiz Content Developer</li>
    </ul>
  </div>

  <div className="about-box">
  <p>
        <h2>Future Directions</h2>
          The project is in its early stages, with plans to enhance the quiz experience by integrating real-time app usage data and refining the personality analysis algorithms. Future iterations may also explore machine learning techniques for deeper insights.
        <h2>My Feedback</h2>
        <p>
          The app is creative and engaging, using phone habits to reflect personality. The quizzes feel relatable and features like  <strong>“Take Another Test” , “Download Results” , “Stength of personality” , “Weakness of personality” , and “Improvement of personailty” </strong> are great. Improvements like clearer result explanations, mobile optimization, and privacy details can boost it further.
        </p>
        </p>
  </div>

  <div className="about-box">
  <h2>Contact Us</h2>
  <p>If you have any questions or feedback, feel free to reach out!</p>
  <a href="mailto:tripti@example.com">📧 Tripti Tiwari – tripti@example.com</a>
  <br />
  <p>Or, if you're interested in collaborating on this project, don't hesitate to reach out!</p>
  <a href="mailto:himanshukumar70222@gmail.com">📧 Himanshu Kumar – himanshukumar70222@gmail.com</a>
  <br />
  <p>We'd love to hear from you!</p>
  <p>Thank you for your interest in our project!</p>
  <br />
  <p>For more information, please visit our GitHub repository:</p>
  <a href="https://github.com/your_username/personality-app" target="_blank" rel="noopener noreferrer">
    🔗 https://github.com/your_username/personality-app
  </a>
  <br />
  <button className="feedback-button" onClick={handleFeedbackClick}>
    Give Feedback
  </button>
</div>

</div>

  );
};

export default About;
