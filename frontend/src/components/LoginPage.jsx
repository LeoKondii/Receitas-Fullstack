import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css";

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setServerError("");
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Erro ao realizar login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span>🍽</span>
          <span className="auth-logo-text">Receitas<span>.com</span></span>
        </div>

        <h1 className="auth-title">Entrar</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className={errors.email ? "auth-input--error" : ""}
              {...register("email", {
                required: "Email é obrigatório",
                pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
              })}
            />
            {errors.email && <span className="auth-error">{errors.email.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Sua senha"
              className={errors.password ? "auth-input--error" : ""}
              {...register("password", { required: "Senha é obrigatória" })}
            />
            {errors.password && <span className="auth-error">{errors.password.message}</span>}
          </div>

          {serverError && <p className="auth-server-error">{serverError}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          Não tem conta?{" "}
          <button onClick={onSwitchToRegister} className="auth-link">
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
}
