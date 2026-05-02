"use client";

import MainLayout from "@/components/layout/MainLayout";
import { KPICards } from "@/components/dashboard/KPICards";
import { EmissionsChart } from "@/components/dashboard/EmissionsChart";
import { PostManager } from "@/components/dashboard/PostManager";
import { useDashboardData } from "@/hooks/useData";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { companies, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full w-full">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">대시보드 데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full w-full">
          <Card className="max-w-md w-full border-destructive/50 bg-destructive/10">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <AlertCircle className="h-10 w-10 text-destructive mb-4" />
              <h3 className="text-lg font-semibold text-destructive mb-2">데이터를 불러오지 못했습니다</h3>
              <p className="text-sm text-destructive/80 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                재시도
              </button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Calculate total emissions
  const totalEmissions = companies.reduce((acc, company) => {
    return acc + company.emissions.reduce((sum, e) => sum + e.emissions, 0);
  }, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">대시보드 개요</h1>
          <p className="text-muted-foreground mt-1">
            전사적 온실가스 배출량을 모니터링하고 관리하세요.
          </p>
        </div>

        <KPICards totalEmissions={totalEmissions} companyCount={companies.length} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EmissionsChart companies={companies} />
          </div>
          <div className="lg:col-span-1">
            <PostManager companies={companies} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
