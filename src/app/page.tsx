"use client";
import { useTheme } from "@/contexts/ThemeContext";
import Seta from "@/components/common/Icons/Seta";
import Card from "@/components/common/Cards/Cards_LadingPage";
import ImageDashboard from "@/components/features/LadingPage/Images_Dashboard";
import CardBeneficio from "@/components/features/LadingPage/Card/Card_Beneficios";
import FAQ from "@/components/common/FAQ";
import { useState } from "react";
import dynamic from "next/dynamic";
const Modal = dynamic(() => import("@/components/common/Modals/Auth/Login"), { ssr: false });
const Login = dynamic(() => import("@/components/common/Modals/Auth/Login/children"), { ssr: false });
const Register = dynamic(() => import("@/components/common/Modals/Auth/Register/children"), { ssr: false });
import Header from "@/components/layout/Header";
import Image from "next/image";
import Button from "@/components/common/Buttons";
import DarkModeToggle from "@/components/common/ButtonColors";
import Footer from "@/components/layout/Footer";

export default function Home() {
  const { darkMode, toggleTheme } = useTheme();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <main className="w-full h-full overflow-x-hidden">
      <Header />

      <section className="flex flex-col lg:flex-row height-[544px] w-full md:max-w-[1150px] mt-0 self-stretch m-auto items-center justify-between text-slate-900 gap-[24px]">
        <div className="flex flex-col w-full lg:w-[47em] items-center lg:items-start gap-[24px] md:gap-[2.56em] px-8 lg:pl-[3.745em]">
          <h1
            className={`text-2xl md:text-4xl lg:text-6xl text-center lg:text-start font-bold !leading-snug w-full ${darkMode ? "text-slate-50" : "text-slate-900"}`}
          >
            Potencialize sua prática clínica com MindTracking
          </h1>

          <p
            className={`text-base lg:text-lg md:text-xl text-center lg:text-start font-semibold !leading-snug ${darkMode ? "text-slate-50" : "text-slate-900"}`}
          >
            Bem-vindo ao MindTracking! A plataforma inteligente desenvolvida para psicólogos e profissionais de saúde mental gerenciarem pacientes, consultas e relatórios clínicos com suporte de IA.
          </p>

          <div className="hidden lg:flex lg:gap-3.5">
            <Button
              text="Fazer login"
              secondary={false}
              onClick={() => setIsLoginModalOpen(true)}
            />

            <Button
              text="Cadastra-se"
              secondary={true}
              onClick={() => setIsRegisterModalOpen(true)}
            />
          </div>

          <Modal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          >
            <Login />
            <Image
              className="hidden lg:flex absolute ml-[45em] mt-[0.575em]"
              src="/images/athena-pulando.png"
              alt="Athena pulando"
              width={230}
              height={180}
              priority
            />
          </Modal>

          <Modal
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
          >
            <Register />
          </Modal>

          <div className="flex flex-col items-center justify-center w-full gap-[24px] lg:hidden">
            <div className="flex md:hidden lg:hidden">
              <DarkModeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
            </div>
            <Button
              text="Fazer login"
              secondary={false}
              widthClass="w-full"
              onClick={() => setIsLoginModalOpen(true)}
            />
            <h1
              className={`text-center text-lg font-bold ${darkMode ? "text-slate-50" : "text-slate-900"}`}
            >
              Ou
            </h1>
            <Button
              text="Cadastra-se"
              secondary={true}
              widthClass="w-full"
              paddingClass="px-10 py-2"
              mtForSecondary="mt-0"
              onClick={() => setIsRegisterModalOpen(true)}
            />
          </div>
        </div>

        <div className="hidden lg:flex">
          <Image
            src="/images/Athena-com-prancheta.png"
            alt="Athena segurando uma prancheta"
            width={220}
            height={427}
          />
        </div>

        <div className="flex md:hidden lg:hidden">
          <Image
            src="/images/Athena-com-prancheta.png"
            alt="Athena segurando uma prancheta"
            width={120}
            height={427}
          />
        </div>

        <div className="hidden md:flex lg:hidden ">
          <Image
            src="/images/Athena-com-prancheta.png"
            alt="Athena segurando uma prancheta"
            width={120}
            height={427}
          />
        </div>
      </section>

      <Seta className="m-auto mt-10" width={32} height={32} />

      <section className="flex flex-col height-[544px] w-full md:max-w-[1150px] mt-16 self-stretch m-auto items-center justify-between text-slate-900 gap-12 px-8 lg:px-12">
        <div className="flex flex-col gap-8 items-center justify-center">
          <h1
            className={`max-w-[788px] font-bold text-2xl md:text-4xl lg:text-6xl !leading-snug text-center ${
              darkMode ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Como a MindTracking transforma sua gestão clínica
          </h1>
          <p
            className={`font-medium md:font-semibold text-base md:text-2xl !leading-snug text-center ${
              darkMode ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Cadastre pacientes, organize consultas e elabore relatórios de atendimento com estruturação por IA. Acompanhe a evolução clínica dos seus pacientes com facilidade.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-12 lg:gap-8">
          <Card
            title="Relatórios clínicos de atendimento"
            parag="Registre observações das consultas e estruture prontuários em poucos cliques."
          />

          <Card
            title="Gestão de pacientes e consultas"
            parag="Gerencie cadastros, prontuários e acompanhe o status dos atendimentos no calendário."
          />

          <Card
            title="Assistente de IA Athena"
            parag="Conte com suporte para tomada de decisão técnica, modelos de documentos e condutas terapêuticas."
          />
        </div>
      </section>

      <section className="flex flex-col height-[544px] w-full md:max-w-[1150px] mt-24 self-stretch m-auto items-center justify-between gap-12 px-8 lg:px-0">
        <div className="flex flex-col gap-8 text-center lg:text-start items-center lg:items-start">
          <h1
            className={`w-full md:w-full md:max-w-full lg:max-w-[13em] font-bold text-2xl md:text-4xl lg:text-6xl !leading-snug ${
              darkMode ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Descubra os benefícios do MindTracking
          </h1>

          <p className="text-[1em] md:text-[1.3214rem] font-semibold !leading-snug">
            Gerencie pacientes, agendamentos e relatórios de consulta de forma prática e intuitiva. Receba insights da assistente Athena para apoiar sua rotina clínica.
          </p>
        </div>

        <div className="w-full flex items-center justify-center md:justify-center lg:justify-between gap-16 py-5 mt-5">
          <Image
            src="/images/Athena-apresentando-dashboard.png"
            className="hidden md:hidden lg:flex"
            width={283}
            height={578}
            alt="Athena apresentando dashboard"
          />

          <div className="flex justify-center md:justify-center lg:justify-start">
            <ImageDashboard />
          </div>
        </div>
      </section>

      <section className="flex flex-col height-[544px] w-full md:max-w-[1150px] mt-10 self-stretch m-auto items-center justify-between gap-12 px-8 lg:px-0">
        <h1
          className={`text-2xl md:text-4xl lg:text-6xl ${darkMode ? "text-slate-50" : "text-slate-900"} font-bold text-center !leading-snug`}
        >
          Potencialize sua rotina e atendimento clínico
        </h1>

        <p
          className={`text-base md:text-2xl ${darkMode ? "text-slate-50" : "text-slate-900"} font-semibold text-center !leading-snug`}
        >
          Ao usar o MindTracking, você otimiza o tempo de documentação e garante maior organização e apoio técnico para suas consultas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 max-w-[1150px] w-full px-4 md:px-8">
          <CardBeneficio
            icon="/images/icons/light-bulb.svg"
            title="Agilidade na Redação Clínica"
            parag="Estruture prontuários e relatórios de atendimento rapidamente com o apoio da IA Athena."
          />

          <CardBeneficio
            icon="/images/icons/list.svg"
            title="Organização Operacional Completa"
            parag="Mantenha o cadastro de pacientes, agenda de consultas e pendências organizadas em um só lugar."
          />

          <CardBeneficio
            icon="/images/icons/heart.svg"
            title="Apoio Técnico e Tomada de Decisão"
            parag="Acesse hipóteses diagnósticas (DSM-5/CID-11) e sugestões de intervenções baseadas em evidências."
          />

          <CardBeneficio
            icon="/images/icons/protect.svg"
            title="Segurança e Praticidade"
            parag="Armazenamento seguro, ambiente intuitivo e suporte contínuo para sua prática profissional."
          />
        </div>
      </section>

      <section className="flex flex-col height-[544px] w-full max-w-full mt-8 mb-16 self-stretch m-auto items-center justify-between gap-12 px-8 lg:px-0 overflow-x-hidden">
        <div className="flex flex-row w-full md:max-w-[1150px] justify-between">
          <div className="flex flex-col items-start justify-center gap-8">
            <h1
              className={`text-2xl md:text-4xl lg:text-6xl ${darkMode ? "text-slate-50" : "text-slate-900"} font-bold text-start !leading-snug`}
            >
              Sua mente tem perguntas?
            </h1>
            <p
              className={`text-base md:text-2xl ${darkMode ? "text-slate-50" : "text-slate-900"} font-medium text-start !leading-snug`}
            >
              É normal ter dúvidas no começo. Por isso, preparamos as respostas
              para as perguntas mais comuns sobre a plataforma.
            </p>
          </div>

          <div>
            <Image
              className="scale-x-[-1] mt-8"
              src="/images/athena-apontando-abaixo.png"
              alt="Athena apontando para baixo"
              width={550}
              height={500}
            />
          </div>
        </div>

        <div className="w-full max-w-full pb-10 mt-5">
          <FAQ />
        </div>
      </section>

      <Footer />
    </main>
  );
}
