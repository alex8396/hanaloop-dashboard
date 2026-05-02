import { Leaf, Search, Bell, UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-sm h-16 w-full">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">탄소 배출량 대시보드</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="검색..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <button className="relative p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
        </button>
        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors">
          <UserCircle className="h-7 w-7 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
