import { Card, CardContent } from "./ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  gradient: string;
  iconBg: string;
}

export function StatCard({ icon, title, value, gradient, iconBg }: StatCardProps) {
  return (
    <Card className={`p-4 border-0 ${gradient} text-white shadow-lg`}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-white/80 text-sm">{title}</span>
            <span className="text-2xl font-bold text-white">{value}</span>
          </div>
          <div className={`p-3 rounded-full ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}