"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Table as TableIcon } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

// Emission Factors Database mock
const EMISSION_FACTORS: Record<string, number> = {
  "한국전력": 0.456,
  "플라스틱 1": 2.3,
  "플라스틱 2": 3.2,
  "트럭": 3.5,
};

type ParsedRow = {
  date: string;
  activity: string;
  description: string;
  amount: number;
  unit: string;
  emissions: number;
};

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [totalCalculated, setTotalCalculated] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setSuccess(false);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

      // Find headers
      let headerRowIndex = -1;
      for (let i = 0; i < json.length; i++) {
        const row = json[i];
        if (row.includes("일자(원본)") || row.includes("활동 유형") || row.includes("량")) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex === -1) {
        throw new Error("Invalid format. Could not find headers: 일자(원본), 활동 유형, 량");
      }

      const rows: ParsedRow[] = [];
      let total = 0;

      for (let i = headerRowIndex + 1; i < json.length; i++) {
        const row = json[i];
        if (!row || row.length < 4) continue;
        
        const date = row[0] || "";
        const activity = row[1] || "";
        const description = row[2] || "";
        const amountStr = row[3] || 0;
        const unit = row[4] || "";
        
        const amount = parseFloat(amountStr);
        if (isNaN(amount)) continue;

        // Calculate emissions using emission factor
        const factor = EMISSION_FACTORS[description] || 0;
        const emissions = amount * factor;
        total += emissions;

        rows.push({
          date: String(date),
          activity,
          description,
          amount,
          unit,
          emissions
        });
      }

      // Simulate API saving
      setTimeout(() => {
        setParsedData(rows);
        setTotalCalculated(total);
        setIsUploading(false);
        setSuccess(true);
      }, 800);

    } catch (error) {
      console.error(error);
      setIsUploading(false);
      alert("엑셀 파일 파싱에 실패했습니다. CT-045 양식과 일치하는지 확인해주세요.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">데이터 임포트</h1>
          <p className="text-muted-foreground mt-1">
            엑셀(CT-045) 활동 데이터를 PostgreSQL로 임포트하고 PCF를 자동 계산합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                활동 데이터 업로드 (엑셀)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-input rounded-xl p-10 flex flex-col items-center justify-center bg-accent/10 hover:bg-accent/20 transition-colors">
                  <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">여기로 엑셀 파일을 드래그 앤 드롭 하세요</p>
                  <p className="text-xs text-muted-foreground mb-4">.xlsx, .xls 파일 지원</p>
                  <Input 
                    type="file" 
                    accept=".xlsx, .xls"
                    className="max-w-xs cursor-pointer" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>

                {success && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">임포트 및 연산 성공</p>
                      <p className="text-xs">총 {parsedData.length}개의 레코드를 추출했습니다. 총 PCF: {totalCalculated.toFixed(2)} kgCO₂e</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button type="submit" disabled={!file || isUploading}>
                    {isUploading ? "처리 중..." : "데이터베이스로 임포트"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {success && parsedData.length > 0 && (
            <Card className="flex flex-col h-[500px]">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TableIcon className="h-5 w-5 text-primary" />
                  PCF 계산 결과 미리보기
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground sticky top-0 text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">일자</th>
                      <th className="px-4 py-3 font-medium">설명 (배출원)</th>
                      <th className="px-4 py-3 font-medium">량</th>
                      <th className="px-4 py-3 font-medium text-right text-primary">배출량 (kgCO₂e)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parsedData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-accent/50">
                        <td className="px-4 py-3 text-xs">{row.date}</td>
                        <td className="px-4 py-3">{row.description}</td>
                        <td className="px-4 py-3">{row.amount} {row.unit}</td>
                        <td className="px-4 py-3 text-right font-medium">{row.emissions.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
