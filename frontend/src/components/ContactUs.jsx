import React, { useState } from 'react';
import axios from 'axios';
import './ContactUs.css';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    thoughts: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contact/contactForm`, formData);
      setFeedbackMessage(response.data.message);
      setFormData({ name: '', email: '', thoughts: '' });
    } catch (error) {
      setFeedbackMessage(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className='outerDiv'>
      <div className='leftDiv'>
        <form onSubmit={handleSubmit}>
          <div className="input-fields">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-fields">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-fields">
            <input
              type="text"
              name="thoughts"
              placeholder="Share your thoughts"
              value={formData.thoughts}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="feedback-button">
            Share your Feedback
          </button>
        </form>
        {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}
      </div>
      <div className='rightDiv'>
        <h1 style={{ fontSize: '50px', marginBottom: '30px' }}>Contact Us</h1>
        <div style={{ margin: '20px 0px' }}>For further inquiries, contact us via: </div>
        <div>
          Email: <span style={{ color: '#405BC8', textDecoration: 'underline' }}>contact@habitflow.com</span>
        </div>
        <div>
          Email: <span style={{ color: '#405BC8', textDecoration: 'underline' }}>support@habitflow.com</span>
        </div>
        <div style={{ margin: '30px 0px' }}>Follow us on Social Media </div>
        <div>
          <FaInstagram style={{ color: 'white', marginRight: '8px' }} />
          Instagram: @habitflow
        </div>
        <div>
          <FaFacebook style={{ color: 'white', marginRight: '8px' }} />
          Facebook: Habitflow
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
