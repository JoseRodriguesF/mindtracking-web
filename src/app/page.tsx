"use client";

import Header from "@/components/layout/Header";
// import Footer from "@/components/layout/Footer";
import Image from "next/image";
import Button from "@/components/common/Buttons";
import Footer from "@/components/layout/Footer";
import DarkModeToggle from "@/components/common/ButtonColors";
import { useTheme } from "@/contexts/ThemeContext";
import Seta from "@/components/common/Icons/Seta";
import Card from "@/components/common/Cards/Cards_LadingPage";
import ImageDashboard from "@/components/features/LadingPage/Images_Dashboard";
import CardBeneficio from "@/components/features/LadingPage/Card/Card_Beneficios";

export default function Home() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <main className="w-full h-full">
      <Header />

      <section className="flex flex-col lg:flex-row height-[544px] w-full md:max-w-[1150px] mt-0 self-stretch m-auto items-center justify-between text-slate-900 gap-[24px]">
        <div className="flex flex-col w-full lg:w-[47em] items-center lg:items-start gap-[24px] md:gap-[2.56em] px-8 lg:pl-[3.745em]">
          <h1
            className={`text-3xl lg:text-5xl md:text-4xl text-center lg:text-start font-bold leading-snug w-full ${darkMode ? "text-slate-50" : "text-slate-900"}`}
          >
            Cuide da sua mente com MindTracking
          </h1>

          <p
            className={`text-base lg:text-lg md:text-xl text-center lg:text-start font-semibold leading-snug ${darkMode ? "text-slate-50" : "text-slate-900"}`}
          >
            Bem-vindo ao MindTracking! Aqui, você pode monitorar seu bem-estar
            emocional e mental de forma simples e eficaz
          </p>

          <div className="hidden lg:flex lg:gap-3.5">
            <Button text="Fazer login" secondary={false} />

            <Button text="Cadastra-se" secondary={true} />
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-[24px] lg:hidden">
            <div className="flex md:hidden lg:hidden">
              <DarkModeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
            </div>
            <Button
              text="Acessar meu espaço"
              secondary={false}
              widthClass="w-full"
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
            className={`max-w-[788px] font-bold text-2xl md:text-4xl leading-snug text-center ${
              darkMode ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Como a MindTracking transforma seu bem-estar
          </h1>
          <p
            className={`font-medium md:font-semibold text-base md:text-2xl leading-snug text-center ${
              darkMode ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Monitore seu estado emocional com os questionários da MindTracking.
            Acompanhe seu progresso e entenda suas emoções com nossos relatórios
            visuais.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-12 lg:gap-8">
          <Card
            title="Questionários que se adaptam ao seu dia"
            parag="Responda a perguntas que refletem seu estado atual."
          />

          <Card
            title="Relatórios visuais para insights profundos"
            parag="Visualize padrões emocionais com gráficos interativos."
          />

          <Card
            title="Acompanhe seu progresso de forma simples"
            parag="Monitore sua evolução emocional com facilidade."
          />
        </div>
      </section>

      <section className="flex flex-col height-[544px] w-full md:max-w-[1150px] mt-16 self-stretch m-auto items-center justify-between gap-12 px-8 lg:px-0">
        <div className="flex flex-col gap-8 text-center lg:text-start items-center lg:items-start">
          <h1
            className={`w-full md:w-full md:max-w-full lg:max-w-[13em] font-bold text-2xl md:text-4xl lg:text-6xl leading-snug ${
              darkMode ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Descubra os benefícios do MindTracking
          </h1>

          <p className="text-[1em] md:text-[1.3214rem] font-semibold leading-snug">
            Acompanhe seu bem-estar emocional de forma prática e intuitiva.
            Receba insights personalizados que ajudam você a entender melhor
            suas emoções.
          </p>
        </div>

        <div className="w-full flex items-center justify-between gap-16 py-5 mt-5">
          <Image
            src="/images/Athena-apresentando-dashboard.png"
            className="hidden md:hidden lg:flex"
            width={283}
            height={578}
            alt="Athena apresentando dashboard"
          />

          <ImageDashboard />
        </div>
      </section>

      <section className="flex flex-col height-[544px] w-full md:max-w-[1150px] mt-16 self-stretch m-auto items-center justify-between gap-12 px-8 lg:px-0">
            <h1 className={`text-5xl ${darkMode ? "text-slate-50" : "text-slate-900"} font-bold text-center`}>Cultive uma Mente mais saúdavel e consciente</h1>
            
            <p className={`text-2xl ${darkMode ? "text-slate-50" : "text-slate-900"} font-semibold text-center`}>Ao usar a MindTracking, você desbloqueia um caminho para um maior bem-estar e autocompreensão</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1150px] w-full px-4 md:px-8">
                <CardBeneficio 
                  icon="/images/icons/light-bulb.svg"
                  title="Desenvolva Autoconhecimento"
                  parag="Entenda seus gatilhos, emoções e o que realmente impacta seu bem-estar."
                />
                <CardBeneficio 
                  icon="/images/icons/list.svg"
                  title="Reduza estresse e ansiedade"
                  parag="Com questionários regulares e suporte, encontre mais calma no seu dia a dia."
                />
                <CardBeneficio 
                  icon="/images/icons/heart.svg"
                  title="Cuide da sua saúde emocional"
                  parag="Crie um espaço dedicado para seu desenvolvimento pessoal e equilíbrio mental."
                />
                <CardBeneficio 
                  icon="/images/icons/protect.svg"
                  title="Fortaleça sua resiliência"
                  parag="Aprenda a lidar com os desafios da vida de forma mais equilibrada e construtiva."
                />
            </div>
      </section>
      
      <section className="flex flex-col height-[544px] w-full md:max-w-[1150px] mt-16 self-stretch m-auto items-center justify-between gap-12 px-8 lg:px-0">
        
      </section>

      {/* <Footer /> */}
    </main>
  );
}
