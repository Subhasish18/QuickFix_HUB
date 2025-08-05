import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, AlertCircle, Navigation, Maximize2, Minimize2 } from 'lucide-react';
import './Map.css';

const Map = ({ city, state }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (city && state) {
      const fetchCoordinates = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&format=json&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else {
            setError('Location not found');
          }
        } catch (error) {
          console.error('Error fetching coordinates:', error);
          setError('Failed to load location');
        } finally {
          setLoading(false);
        }
      };
      fetchCoordinates();
    }
  }, [city, state]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMapLoad = () => {
    setTimeout(() => setMapLoaded(true), 500);
  };

  const openInGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/${encodeURIComponent(city + ', ' + state)}`,
      '_blank'
    );
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={`map-container ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="map-loader">
          <div className="loader-content">
            <Loader2 className="loader-icon" />
            <p className="loader-text">Loading map...</p>
            <div className="loader-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`map-container error-state ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="error-content">
          <AlertCircle className="error-icon" />
          <h3 className="error-title">Unable to load map</h3>
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className={`map-container ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="no-location">
          <MapPin className="no-location-icon" />
          <p>No location data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`map-container ${isFullscreen ? 'fullscreen' : ''} ${mapLoaded ? 'loaded' : ''}`}>
      {/* Map Header */}
      <div className="map-header">
        <div className="location-info">
          <MapPin className="location-icon" />
          <span className="location-text">{city}, {state}</span>
        </div>
        <div className="map-controls">
          <button 
            className="control-button"
            onClick={openInGoogleMaps}
            title="Open in Google Maps"
          >
            <Navigation className="control-icon" />
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="map-content">
        {/* ✅ Keep the default OSM marker */}
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${position[1] - 0.01},${position[0] - 0.01},${position[1] + 0.01},${position[0] + 0.01}&layer=mapnik&marker=${position[0]},${position[1]}`}
          className="map-iframe"
          onLoad={handleMapLoad}
          title={`Map of ${city}, ${state}`}
        />
      </div>

      {/* Map Footer */}
      <div className="map-footer">
        <div className="coordinates">
          <span className="coord-label">Coordinates:</span>
          <span className="coord-value">
            {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </span>
        </div>
        {/* <div className="attribution">
          © OpenStreetMap contributors
        </div> */}
      </div>
    </div>
  );
};

export default Map;
