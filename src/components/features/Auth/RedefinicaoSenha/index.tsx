"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ForgotPasswordModal = dynamic(() => import("./VerificacaoEmail"), { ssr: false });
const VerifyCodeModal = dynamic(() => import("./VerificacaoCodigo"), { ssr: false });
const ResetPasswordModal = dynamic(() => import("./AtualizacaoSenha"), { ssr: false });

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback opcional para quando a redefinição for bem-sucedida
}

export default function RedefinicaoSenhaFlow({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [currentStep, setCurrentStep] = useState<"email" | "code" | "password">(
    "email",
  );
  const [userEmail, setUserEmail] = useState("");

  const handleEmailSuccess = (email: string) => {
    setUserEmail(email);
    setCurrentStep("code");
  };

  const handleCodeSuccess = () => {
    setCurrentStep("password");
  };

  const handlePasswordSuccess = () => {
    onSuccess?.(); // Chama callback opcional
    handleClose(); // Fecha o fluxo
  };

  const handleClose = () => {
    setCurrentStep("email");
    setUserEmail("");
    onClose();
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setUserEmail("");
  };

  const handleBackToCode = () => {
    setCurrentStep("code");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      if (currentStep === "email") {
        document.getElementById("email-submit")?.click();
      } else if (currentStep === "code") {
        document.getElementById("code-submit")?.click();
      } else if (currentStep === "password") {
        document.getElementById("password-submit")?.click();
      }
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Modal de Verificação de Email */}
      <ForgotPasswordModal
        isOpen={isOpen && currentStep === "email"}
        onClose={handleClose}
        onSuccess={handleEmailSuccess}
        submitButtonId="email-submit"
      />

      {/* Modal de Verificação de Código */}
      <VerifyCodeModal
        isOpen={isOpen && currentStep === "code"}
        onClose={handleBackToEmail}
        onSuccess={handleCodeSuccess}
        email={userEmail}
        submitButtonId="code-submit"
      />

      {/* Modal de Redefinição de Senha */}
      <ResetPasswordModal
        isOpen={isOpen && currentStep === "password"}
        onClose={handleBackToCode}
        onSuccess={handlePasswordSuccess}
        email={userEmail}
        submitButtonId="password-submit"
      />
    </div>
  );
}
