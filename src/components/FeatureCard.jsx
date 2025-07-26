const FeatureCard = ({ title, description, children, className = "" }) => {
  return (
    <div className={`feature-card ${className}`}>
      <h3 className="feature-card-title">{title}</h3>
      {description && (
        <p className="feature-card-description">{description}</p>
      )}
      <div className="feature-card-content">
        {children}
      </div>
    </div>
  );
};

export default FeatureCard;
