import React from 'react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Homeowner',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 5,
      text: 'I was impressed by how quickly I was able to book a plumber. The service was excellent and the pricing transparent. Will definitely use again!'
    },
    {
      id: 2,
      name: 'Rohan Mehta',
      role: 'Small Business Owner',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 5,
      text: 'Found an electrician for our office renovation through this platform. The booking process was seamless and the work was completed to a high standard.'
    },
    {
      id: 3,
      name: 'Anjali Gupta',
      role: 'Apartment Renter',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      rating: 4,
      text: 'Such a time-saver! I needed urgent cleaning services and was connected with a professional within hours. Great communication throughout.'
    }
  ];

  const StarRating = ({ rating }) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`star ${i < rating ? 'filled' : 'empty'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="header">
          <h2 className="title">What Our Customers Say</h2>
          <p className="subtitle">
            Don't just take our word for it. Here's what people are saying about their experience.
          </p>
        </div>

        <div className="cards">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card">
              <div className="user">
                <img src={testimonial.image} alt={testimonial.name} className="avatar" />
                <div className="info">
                  <h4 className="name">{testimonial.name}</h4>
                  <p className="role">{testimonial.role}</p>
                </div>
              </div>

              <StarRating rating={testimonial.rating} />

              <p className="text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
