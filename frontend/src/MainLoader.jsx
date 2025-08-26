import './MainLoader.css';

const Loader = () => {
  return (
      <div className="loader-wrapper">
        <div className="loader">
          <span><span /><span /><span /><span /></span>
          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>
        <div className="longfazers">
          <span /><span /><span /><span />
        </div>

        {/* ✅ Catchy line */}
        <p className="loader-tagline">Service at your doorstep in light speed</p>
      </div>

  );
}

export default Loader;
