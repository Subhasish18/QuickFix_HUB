import React, { useMemo, useState, useEffect, useCallback } from 'react'; 
import { Card, ProgressBar, Button, Form } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// CSS to disable progress bar animations
const progressBarStyle = `
  .progress-bar {
    transition: none !important;
    animation: none !important;
  }
  .progress-bar-striped {
    background-image: none !important;
  }
  .progress-bar-animated {
    animation: none !important;
  }
`;

// Inject the CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = progressBarStyle;
  document.head.appendChild(styleElement);
}

const RatingsCard = ({ providerId = 'default' }) => {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentReviews, setRecentReviews] = useState([]); 

  const fetchReviews = useCallback(async () => {
    if (providerId === 'default') return;
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/${providerId}`);
      setRecentReviews(response.data);
      console.log(`[Booking Page] Fetched ${response.data.length} reviews for provider ${providerId}`);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews. Please try again later.');
    }
  }, [providerId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const ratings = useMemo(() => {
    const hash = providerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = hash * 12345;
    const baseRating = 3.9 + (seededRandom(seed) * 0.8);
    const average = Math.round(baseRating * 10) / 10; 
    const total = Math.floor(45 + (seededRandom(seed + 1) * 75));
    
    const fiveStarBase = average >= 4.5 ? 60 : average >= 4.2 ? 45 : 30;
    const fourStarBase = average >= 4.3 ? 25 : average >= 4.0 ? 35 : 40;
    const threeStarBase = average >= 4.2 ? 8 : average >= 4.0 ? 15 : 20;
    const twoStarBase = average >= 4.1 ? 5 : 8;
    const oneStarBase = average >= 4.2 ? 2 : 5;
    
    const fiveStarCount = Math.floor(total * (fiveStarBase + seededRandom(seed + 2) * 10) / 100);
    const fourStarCount = Math.floor(total * (fourStarBase + seededRandom(seed + 3) * 10) / 100);
    const threeStarCount = Math.floor(total * (threeStarBase + seededRandom(seed + 4) * 5) / 100);
    const twoStarCount = Math.floor(total * (twoStarBase + seededRandom(seed + 5) * 3) / 100);
    const oneStarCount = total - fiveStarCount - fourStarCount;
    
    const distribution = [
      { stars: 5, count: fiveStarCount, percentage: Math.round((fiveStarCount / total) * 100) },
      { stars: 4, count: fourStarCount, percentage: Math.round((fourStarCount / total) * 100) },
      { stars: 3, count: threeStarCount, percentage: Math.round((threeStarCount / total) * 100) },
      { stars: 2, count: twoStarCount, percentage: Math.round((twoStarCount / total) * 100) },
      { stars: 1, count: oneStarCount, percentage: Math.round((oneStarCount / total) * 100) },
    ];
    
    return { average, total, distribution };
  }, [providerId]);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill={star <= rating ? '#ffc107' : '#e9ecef'}
        className="bi bi-star-fill"
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>
    ));
  };

  const renderInteractiveStars = (rating, hovered) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill={star <= (hovered || rating) ? '#ffc107' : '#e9ecef'}
        className="bi bi-star-fill"
        viewBox="0 0 16 16"
        style={{ cursor: 'pointer', marginRight: '4px' }}
        onMouseEnter={() => setHoveredStar(star)}
        onMouseLeave={() => setHoveredStar(0)}
        onClick={() => setUserRating(star)}
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>
    ));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userRating || !userReview.trim()) {
      toast.warn('Please provide both a rating and review before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast.error('Please log in to submit a review.');
        setIsSubmitting(false);
        return;
      }
      const authToken = await currentUser.getIdToken();

      const reviewData = {
        providerId: providerId,
        rating: userRating,
        comment: userReview,
      };

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      };

      const response = await axios.post('http://localhost:5000/api/reviews', reviewData, {
        headers: headers
      });

      if (response.status === 201) {
        toast.success('Review submitted successfully!');
        setUserRating(0);
        setUserReview('');
        setHoveredStar(0);
        fetchReviews();
        
        window.dispatchEvent(new CustomEvent('reviewSubmitted', {
          detail: { providerId, rating: userRating, comment: userReview }
        }));
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      
      if (error.response?.status === 401) {
        toast.error('Authentication error. Please log in again.');
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header>
          <Card.Title as="h5" className="mb-0">Ratings & Reviews</Card.Title>
          <small className="text-muted">Leave your feedback for this provider</small>
        </Card.Header>
        <Card.Body>
          <div className="row align-items-center">
            <div className="col-4 text-center">
              <div className="fs-1 fw-bold">{ratings.average}</div>
              <div className="d-flex justify-content-center mt-1">
                {renderStars(Math.round(ratings.average))}
              </div>
              <div className="text-muted mt-1" style={{ fontSize: '0.875rem' }}>
                {ratings.total} reviews
              </div>
            </div>

            <div className="col-8">
              {ratings.distribution.map((item) => (
                <div key={item.stars} className="d-flex align-items-center mb-1">
                  <div className="d-flex align-items-center me-2" style={{ width: '40px' }}>
                    <span>{item.stars}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      className="bi bi-star-fill ms-1"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                  </div>
                  <ProgressBar
                    now={item.percentage}
                    variant="primary"
                    style={{ height: '8px', flex: 1, transition: 'none', animation: 'none' }}
                    className="me-2 static-progress-bar"
                  />
                  <span style={{ width: '40px', fontSize: '0.875rem' }}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-top">
            <h6 className="mb-3">Leave a Review</h6>
            
            <div className="bg-light p-3 rounded mb-4">
              <Form onSubmit={handleSubmitReview}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <div className="d-flex align-items-center">
                    {renderInteractiveStars(userRating, hoveredStar)}
                    <span className="ms-2 text-muted">
                      {userRating > 0 ? `${userRating} star${userRating > 1 ? 's' : ''}` : 'Click to rate'}
                    </span>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Your Review</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Write your review here..."
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </Form>
            </div>

            <h6 className="mb-3">Recent Comments</h6>

            <div className="d-flex flex-column gap-3">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review._id} className="bg-light p-3 rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-medium">
                        {review.userId?.name || 'Anonymous'}
                        {review.userId?.city && review.userId?.state
                          ? ` (${review.userId.city}, ${review.userId.state})`
                          : ''}
                      </span>
                      <div className="d-flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="mt-1 mb-0" style={{ fontSize: '0.875rem' }}>
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted">No reviews yet. Be the first to leave a review!</p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default RatingsCard;
