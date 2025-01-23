// src/pages/LandingPage.jsx
import '../styles/landing.css';

function LandingPage() {
    return (
        <div className="landing-page">
            <header className="landing-header">
                <h1>Welcome to Very Schooly</h1>
                <p>Your gateway to efficient school management.</p>
                <button className="cta-button">Get Started</button>
            </header>
            <section className="features">
                <div className="feature">
                    <i className="icon-student"></i>
                    <h2>Manage Students</h2>
                    <p>Keep track of student details seamlessly.</p>
                </div>
                <div className="feature">
                    <i className="icon-classes"></i>
                    <h2>Organize Classes</h2>
                    <p>Easily schedule and manage classes.</p>
                </div>
                <div className="feature">
                    <i className="icon-performance"></i>
                    <h2>Monitor Performance</h2>
                    <p>Analyze and enhance academic progress.</p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
