"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { MainLayout } from "@/components/layout/MainLayout";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden h-full">
        <SwaggerUI url="/swagger.yaml" />
      </div>
    </MainLayout>
  );
}
