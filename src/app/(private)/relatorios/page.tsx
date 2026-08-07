"use client";

import React, { Suspense } from "react";
import RelatoriosClient from "./RelatoriosClient";

export default function RelatoriosPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <RelatoriosClient />
    </Suspense>
  );
}
