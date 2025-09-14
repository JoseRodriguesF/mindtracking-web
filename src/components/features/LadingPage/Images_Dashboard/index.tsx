import React from "react";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

const ImageDashboard = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className="relative m-auto md:m-0 w-[300px] h-[300px] md:w-[600px] md:h-[400px] lg:w-[1000px] lg:h-[500px] mt-[-4em]">
      <div className="absolute my-0" style={{
        top: darkMode ? 0 : 60,
        left: darkMode ? 0 : 60,
        zIndex: darkMode ? 1 : 2
      }}>
        <Image
          src={"/images/Dashboard-light.png"}
          className="rounded-2xl border-2 border-blue-600 shadow-2xl shadow-slate-800"
          width={700}
          height={500}
          alt="Dashboard do MindTracking - Modo Claro"
          priority
        />
      </div>
      <div className="absolute my-0" style={{
        top: darkMode ? 60 : 0,
        left: darkMode ? 60 : 0,
        zIndex: darkMode ? 2 : 1
      }}>
        <Image
          src={"/images/Dashboard-dark.png"}
          className="rounded-2xl border-2 border-blue-600 shadow-2xl shadow-slate-800"
          width={700}
          height={500}
          alt="Dashboard do MindTracking - Modo Escuro"
          priority
        />
      </div>
    </div>
  );
};

export default ImageDashboard;
