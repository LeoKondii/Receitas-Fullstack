import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPage.css";

export default function RegisterPage({ onSwitchToLogin }) {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    setServerError("");
    setLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (err) {
      setServerError(
        err.response?.data?.error || "Erro ao cadastrar. Tente novamente."
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

        <h1 className="auth-title">Criar conta</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label htmlFor="name">Nome</label>
            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              className={errors.name ? "auth-input--error" : ""}
              {...register("name", { required: "Nome é obrigatório" })}
            />
            {errors.name && <span className="auth-error">{errors.name.message}</span>}
          </div>

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
              placeholder="Mínimo 6 caracteres"
              className={errors.password ? "auth-input--error" : ""}
              {...register("password", {
                required: "Senha é obrigatória",
                minLength: { value: 6, message: "Senha deve ter pelo menos 6 caracteres" },
              })}
            />
            {errors.password && <span className="auth-error">{errors.password.message}</span>}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha"
              className={errors.confirmPassword ? "auth-input--error" : ""}
              {...register("confirmPassword", {
                required: "Confirmação é obrigatória",
                validate: (val) =>
                  val === watch("password") || "As senhas não coincidem",
              })}
            />
            {errors.confirmPassword && (
              <span className="auth-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          {serverError && <p className="auth-server-error">{serverError}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p className="auth-switch">
          Já tem conta?{" "}
          <button onClick={onSwitchToLogin} className="auth-link">
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
