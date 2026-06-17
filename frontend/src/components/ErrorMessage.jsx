import "./ErrorMessage.css";

export default function ErrorMessage({ message }) {
  return (
    <div className="error-wrapper" role="alert">
      <span className="error-icon">⚠️⚠⚠️</span>
      <p className="error-text">{message}</p>
    </div>
  );
}