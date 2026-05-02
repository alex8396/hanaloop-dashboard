"use client";

import { BarChart3, FileSpreadsheet, Leaf, FileCode } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "대시보드 개요",
      href: "/",
      icon: BarChart3,
    },
    {
      name: "데이터 임포트",
      href: "/import",
      icon: FileSpreadsheet,
    },
    {
      name: "API 문서 (Swagger)",
      href: "/api-docs",
      icon: FileCode,
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border bg-card h-screen flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Leaf className="h-6 w-6 text-primary mr-2" />
        <h1 className="text-xl font-bold tracking-tight text-primary">HanaLoop</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-primary/10 p-4">
          <p className="text-xs font-semibold text-primary mb-1">탄소 중립 목표</p>
          <p className="text-xs text-muted-foreground mb-3">2030년 목표 달성 순항 중</p>
          <div className="h-2 w-full bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[65%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
