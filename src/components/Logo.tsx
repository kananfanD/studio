import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

const Logo = ({ className, iconSize = 8, textSize = "text-2xl" }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <Settings className={`h-${iconSize} w-${iconSize}`} strokeWidth={2} />
      <span className={`${textSize} font-bold`}>EquipCare Hub</span>
    </div>
  );
};

export default Logo;
