import React from 'react';
import { motion } from 'framer-motion';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Search',
      description: 'Browse services or search for specific providers in your area',
      icon: '🔍',
      colorClass: 'red'
    },
    {
      id: 2,
      title: 'Book',
      description: 'Select a date and time that works for your schedule',
      icon: '📅',
      colorClass: 'blue'
    },
    {
      id: 3,
      title: 'Get Service',
      description: 'Enjoy professional service delivered right to your doorstep',
      icon: '✅',
      colorClass: 'green'
    }
  ];

  return (
    <section className="hiw-section">
      <div className="hiw-container">
        <motion.div
          className="hiw-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-subtitle">
            Getting the service you need is simple and straightforward with our platform.
          </p>
        </motion.div>

        <div className="hiw-steps">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`hiw-step ${step.colorClass}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="hiw-icon">{step.icon}</div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-desc">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hiw-arrow">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
