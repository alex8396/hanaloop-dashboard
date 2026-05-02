"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { MainLayout } from "@/components/layout/MainLayout";

// swagger-ui-react는 브라우저 전용 라이브러리이므로 SSR을 비활성화하고 default export를 명시적으로 가져옵니다.
const SwaggerUI = dynamic(() => import("swagger-ui-react").then((mod) => mod.default), { 
  ssr: false,
  loading: () => <div className="p-8 text-muted-foreground">Loading API Documentation...</div>
});

export default function ApiDocs() {
  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden h-full">
        <SwaggerUI url="/swagger.yaml" />
      </div>
    </MainLayout>
  );
}
