import React, { useMemo, useState, useEffect, useCallback } from 'react'; 
import { Card, ProgressBar, Button, Form } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const RatingsCard = ({ providerId = 'default', isProviderView = true }) => {
  const [recentReviews, setRecentReviews] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);


  const fetchReviews = useCallback(async () => {
    if (providerId === 'default') return;
    try {
      console.log(`[Provider Profile] Fetching reviews for provider:`, providerId, 'Type:', typeof providerId);
      const response = await axios.get(`http://localhost:5000/api/reviews/${providerId}`);
      setRecentReviews(response.data);
      console.log(`[Provider Profile] Fetched ${response.data.length} reviews for provider ${providerId}`);
      if (response.data.length > 0) {
        console.log('[Provider Profile] Sample review:', response.data[0]);
      }
    } catch (error) {
      console.error('[Provider Profile] Error fetching reviews:', error);
      console.error('[Provider Profile] Error response:', error.response?.data);
    }
  }, [providerId, refreshKey]);


  useEffect(() => {
    fetchReviews();

    const interval = setInterval(() => {
      console.log('[Provider Profile] Polling for new reviews...');
      fetchReviews();
    }, 30000);
    
    const handleReviewSubmitted = (event) => {
      const { providerId: reviewProviderId } = event.detail;
      if (reviewProviderId === providerId) {
        console.log('[Provider Profile] New review detected via custom event, refreshing...');
        fetchReviews();
      }
    };
    
    window.addEventListener('reviewSubmitted', handleReviewSubmitted);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted);
    };
  }, [fetchReviews, providerId]);
  

  const refreshReviews = () => {
    setRefreshKey(prev => prev + 1);
  };


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
    const oneStarCount = total - fiveStarCount - fourStarCount - threeStarCount - twoStarCount;
    
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

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <Card.Title as="h5" className="mb-0">Your Ratings & Reviews</Card.Title>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={refreshReviews}
          title="Refresh reviews"
        >
          🔄 Refresh
        </Button>
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
                  style={{ height: '8px', flex: 1 }}
                  className="me-2"
                  striped={false}
                  animated={false}
                />
                <span style={{ width: '40px', fontSize: '0.875rem' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-top">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Customer Reviews</h6>
            <small className="text-muted">
              Last updated: {new Date().toLocaleTimeString()}
            </small>
          </div>

           <div className="d-flex flex-column gap-3">
            {recentReviews.length > 0 ? (
              recentReviews.map((review) => (
                <div key={review._id} className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
       
                    <span className="fw-medium">{review.userId?.name || 'Anonymous'}</span>
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
  );
};

export default RatingsCard;