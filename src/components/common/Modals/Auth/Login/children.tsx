import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { login as loginApi } from "@/lib/api/auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import IconInput from "@/components/common/Inputs/InputEmail";
import PasswordInput from "@/components/common/Inputs/InputSenha";
import Button from "@/components/common/Buttons";
import { validateEmail } from "@/lib/validation";
import ForgotPasswordModal from "@/components/features/Auth/RedefinicaoSenha/VerificacaoEmail";
import ButtonEsqueceuSenha from "@/components/common/Buttons/ButtonEsqueceuSenha";

interface User {
  questionario_inicial?: boolean;
  questionarioInicial?: boolean;
}

export default function Login() {
  const { theme } = useTheme();
  const { syncAuthState } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setApiError(null); // Limpa erro da API ao digitar
    const error = validateEmail(value);
    setEmailError(error);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setApiError(null); // Limpa erro da API ao digitar
    setPasswordError(value.length === 0 ? "Senha obrigatória" : null);
  };

  // Memoiza a validação do formulário para melhor performance
  const isFormValid = useMemo(() => {
    const hasEmail = email.trim() !== "";
    const hasPassword = password.trim() !== "";
    const emailValid = !emailError && hasEmail;
    const passwordValid = !passwordError && hasPassword;

    return hasEmail && hasPassword && emailValid && passwordValid;
  }, [email, password, emailError, passwordError]);

  const handleLoginClick = async () => {
    // Previne múltiplos cliques
    if (loading) return;

    setApiError(null);

    // Validações finais antes de enviar
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }
    if (!password) {
      setPasswordError("Senha obrigatória");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(email, password);

      // Normaliza o objeto user
      let userObj: User | null = null;
      try {
        if (!res.user) {
          userObj = null;
        } else if (typeof res.user === "string") {
          userObj = JSON.parse(res.user);
        } else if (Array.isArray(res.user)) {
          userObj = res.user.length > 0 ? res.user[0] : null;
        } else {
          userObj = res.user as User;
        }
      } catch {
        userObj = res.user as User;
      }

      const questionarioInicial =
        res?.questionario_inicial ??
        res?.questionarioInicial ??
        (userObj &&
          (userObj.questionario_inicial ??
            userObj.questionarioInicial ??
            null));

      // Armazena token e user
      syncAuthState(res.token ?? null, res.user);
      if (typeof window !== "undefined") {
        if (res.token) {
          sessionStorage.setItem("mt_token", res.token);
        } else {
          sessionStorage.removeItem("mt_token");
        }
      }
      // Redireciona conforme questionario_inicial
      if (questionarioInicial === false) {
        router.push("/questionnaire");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      const apiErrorMessage = (
        error as { response?: { data?: { message?: string } } }
      )?.response?.data?.message;

      setApiError(
        apiErrorMessage ||
          errorMessage ||
          "Erro ao fazer login. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && isFormValid) {
      handleLoginClick();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-between w-full md:w-[28.125em] gap-4">
        <Image
          src={
            theme === "dark"
              ? "../images/icons/Logo_branca.svg"
              : "../images/icons/Logo-slate-900.svg"
          }
          alt="logo"
          width={64}
          height={64}
        />
        <div className="flex flex-col items-center justify-between w-full gap-2">
          <h1 className="text-center text-2xl md:text-3xl font-bold leading-snug">
            Bem-vindo de volta
          </h1>
          <h2 className="text-center text-base md:text-lg leading-snug">
            Seu bem-estar importa todos os dias
          </h2>
        </div>
        <div className="flex flex-col gap-6" onKeyDown={handleKeyDown}>
          <IconInput
            width="w-full"
            type="email"
            id="forgot-email"
            name="email"
            label="Email"
            icon={
              theme === "dark"
                ? "../images/icons/UsuarioEmail.svg"
                : "../images/icons/UsuarioEmail-black.svg"
            }
            iconClassName="w-6.5 h-auto"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            value={email}
            onChange={handleEmailChange}
            error={emailError}
            required
          />

          <PasswordInput
            width="w-full"
            type="password"
            id="forgot-password"
            name="password"
            label="Senha"
            value={password}
            onChange={handlePasswordChange}
            error={passwordError}
            required
          />
        </div>
        <div className="flex w-full max-w-72 md:max-w-full justify-end">
          <ButtonEsqueceuSenha
            className={`text-right text-sm md:text-base font-bold ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            Esqueceu sua senha?
          </ButtonEsqueceuSenha>
        </div>

        {apiError && (
          <div className="w-full text-center text-red-500 text-sm ">
            {apiError}
          </div>
        )}

        <div className="w-full flex flex-col items-center">
          <Button
            text="Entrar"
            widthClass="w-full"
            type="button"
            onClick={handleLoginClick}
            disabled={!isFormValid || loading}
            loading={loading}
          />
        </div>
        <ForgotPasswordModal
          isOpen={isForgotPasswordModalOpen}
          onClose={() => setIsForgotPasswordModalOpen(false)}
          onSuccess={() => setIsForgotPasswordModalOpen(false)}
        />
      </div>
    </div>
  );
}
