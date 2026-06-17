import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-wrapper" role="status">
      <div className="loader-dots">
        <span /><span /><span />
      </div>
      <p className="loader-text">Buscando receitas...</p>
    </div>
  );
}