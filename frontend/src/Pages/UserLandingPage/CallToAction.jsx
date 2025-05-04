import React from 'react';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2 className="cta-title">
            Are You a Service Professional?
          </h2>
          <p className="cta-subtitle">
            Get discovered by customers looking for reliable services—join our platform today.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">
              Join as a Professional
            </button>
            <button className="btn-secondary">
              Learn More
            </button>
          </div>
          <p className="cta-footer">
            No obligations or commitments. Find what you need today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
