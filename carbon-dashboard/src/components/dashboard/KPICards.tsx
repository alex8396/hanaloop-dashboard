import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, TrendingDown, Wind } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface KPICardsProps {
  totalEmissions: number;
  companyCount: number;
}

export function KPICards({ totalEmissions, companyCount }: KPICardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 온실가스 배출량</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{formatNumber(totalEmissions)} tCO₂e</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 inline-flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.4%
            </span>{" "}
            전 분기 대비
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">모니터링 중인 시설</CardTitle>
          <Factory className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{companyCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            3개 국가에서 운영 중
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">데이터 동기화 상태</CardTitle>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">최신 상태 유지됨</div>
          <p className="text-xs text-muted-foreground mt-1">
            최근 동기화: 10분 전
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
