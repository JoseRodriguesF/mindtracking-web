"use client";

import { useState } from "react";
import Image from "next/image";
import { SidebarItem } from "./SidebarItem";
import {
  LayoutDashboard,
  NotebookPen,
  MessageSquareHeart,
  Moon,
  Sun,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard size={24} />,
    href: "/dashboard",
  },
  {
    title: "Seu diário emocional",
    icon: <NotebookPen size={24} />,
    href: "/diario",
  },
  { title: "Athena", icon: <MessageSquareHeart size={24} />, href: "/athena" },
];

const bottomItems = [
  {
    title: "Perguntas Frequentes",
    icon: <HelpCircle size={24} />,
    href: "/faq",
  },
  { title: "Sair da conta", icon: <LogOut size={24} />, href: "/logout" },
];

export default function Sidebar({
  onToggle,
}: {
  onToggle?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Header mobile/tablet fixo no topo */}
      {!mobileOpen && (
        <div
          className={`lg:hidden fixed top-9 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-transparent ${theme === "dark" ? "text-white" : "text-black"}`}
        >
          <div className="flex items-center gap-2">
            <Image
              src="/images/Logo-blue-600-w2.svg"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <h1 className="text-lg font-bold">Mindtracking</h1>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Alternar menu"
            className="cursor-pointer"
          >
            <Image src="/images/menu.svg" alt="Menu" width={28} height={28} />
          </button>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside
        onMouseEnter={() => {
          setIsOpen(true);
          onToggle?.(true);
        }}
        onMouseLeave={() => {
          setIsOpen(false);
          onToggle?.(false);
        }}
        className={`fixed left-0 top-0 h-screen shadow-lg border-r transition-all py-8.5 md ease-in-out duration-300 z-40
        ${isOpen ? "w-100 pl-9" : "w-37.5"}
        hidden lg:flex flex-col justify-between
        ${theme === "dark" ? "bg-gray-800 border-gray-600" : "bg-white border-gray-200"}`}
      >
        {/* Top Logo */}
        <div>
          <div
            className={`flex items-center gap-2 p-4 ${isOpen ? "justify-start" : "justify-center"}`}
          >
            <Image
              src={
                theme === "dark"
                  ? "/images/Logo-blue-600-w2.svg"
                  : "/images/Logo.svg"
              }
              alt="Logo"
              width={49}
              height={45}
              className="rounded-full"
            />
            {isOpen && (
              <span
                className={`font-semibold text-[22px] whitespace-nowrap ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                MindTracking
              </span>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-1 mt-4">
            {menuItems.map((item, idx) => (
              <SidebarItem
                key={idx}
                href={item.href}
                icon={item.icon}
                label={item.title}
                isOpen={isOpen}
                theme={theme}
                className="whitespace-nowrap"
              />
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mb-4 flex flex-col">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer
       ${isOpen ? "justify-start" : "justify-center"}
       ${theme === "dark" ? "text-gray-100 hover:bg-gray-700" : "text-[#0F172A] hover:bg-gray-100"}`}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            {isOpen && (
              <span
                className={`font-semibold text-[22px] whitespace-nowrap ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </span>
            )}
          </button>

          {bottomItems.map((item, idx) => (
            <SidebarItem
              key={idx}
              href={item.href}
              icon={item.icon}
              label={item.title}
              isOpen={isOpen}
              theme={theme}
              className="whitespace-nowrap"
            />
          ))}

          <div
            className={`flex px-3 mt-4 ${isOpen ? "justify-start" : "justify-center"}`}
          >
            <Image
              src="/images/Perfil.png"
              alt="User"
              width={60}
              height={60}
              className="rounded-full border cursor-pointer"
            />
          </div>
        </div>
      </aside>

      {/* Sidebar mobile (overlay) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 pt-14 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className={`fixed top-0 h-full left-0 w-75 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-[#0F172A]"} pt-7 z-50`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 px-5">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/Logo-blue-600-w2.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <h2 className="text-xl font-bold">Mindtracking</h2>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="cursor-pointer"
              >
                <Image
                  src="/images/plus-circle.svg"
                  alt="Menu"
                  width={32}
                  height={32}
                />
              </button>
            </div>

            <nav className="flex flex-col gap-1 mt-4">
              {menuItems.map((item, idx) => (
                <SidebarItem
                  key={idx}
                  href={item.href}
                  icon={item.icon}
                  label={item.title}
                  isOpen={true}
                  theme={theme}
                  className="whitespace-nowrap"
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-6 flex flex-col">
              <button
                onClick={toggleTheme}
                className={`flex items-center gap-3 p-3 mx-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  theme === "dark"
                    ? "text-gray-100 hover:bg-gray-700"
                    : "text-[#0F172A] hover:bg-gray-100"
                }`} 
              >
                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                <span
                  className={`font-semibold text-[22px] whitespace-nowrap ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  {theme === "dark" ? "Modo claro" : "Modo escuro"}
                </span>
              </button>

              <div className="mt-4">
                {bottomItems.map((item, idx) => (
                  <SidebarItem
                    key={idx}
                    href={item.href}
                    icon={item.icon}
                    label={item.title}
                    isOpen={true}
                    theme={theme}
                    className="whitespace-nowrap"
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
              </div>

              <div className="flex px-5 mt-4 justify-start">
                <Image
                  src="/images/Perfil.png"
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full border cursor-pointer"
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
