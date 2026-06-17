import { useState } from "react";
import { RecipeProvider } from "./contexts/RecipeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AddRecipeForm from "./components/AddRecipeForm";
import "./App.css";

function AppContent() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState("login");
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  if (!user) {
    if (authView === "login") {
      return <LoginPage onSwitchToRegister={() => setAuthView("register")} />;
    }
    return <RegisterPage onSwitchToLogin={() => setAuthView("login")} />;
  }

  function handleRecipeSuccess() {
    setSuccessMessage("Receita adicionada com sucesso!");
    setTimeout(() => setSuccessMessage(""), 3000);
  }

  return (
    <RecipeProvider>
      <div className="app">
        <Header onAddRecipe={() => setShowAddRecipe(true)} />
        <main className="main">
          {successMessage && (
            <div className="success-banner">{successMessage}</div>
          )}
          <SearchForm />
          <RecipeList />
        </main>
        <RecipeModal />
        {showAddRecipe && (
          <AddRecipeForm
            onClose={() => setShowAddRecipe(false)}
            onSuccess={handleRecipeSuccess}
          />
        )}
        <footer className="footer">
          <p>
            Receitas por{" "}
            <a href="https://www.themealdb.com" target="_blank" rel="noopener noreferrer">
              TheMealDB
            </a>{" "}
            · Receitas.com
          </p>
        </footer>
      </div>
    </RecipeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
