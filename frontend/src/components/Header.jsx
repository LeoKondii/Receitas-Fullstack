import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

export default function Header({ onAddRecipe }) {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">🍽</span>
          <span className="logo-text">
            Receitas<span className="logo-dot">.com</span>
          </span>
        </div>

        <div className="header-actions">
          {user && (
            <>
              <span className="header-user">Olá, {user.name.split(" ")[0]}</span>
              <button className="header-btn header-btn--add" onClick={onAddRecipe}>
                + Nova receita
              </button>
              <button className="header-btn header-btn--logout" onClick={logout}>
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
