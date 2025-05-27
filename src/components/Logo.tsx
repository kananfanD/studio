
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  hideText?: boolean; // Added new prop
}

const Logo = ({ className, iconSize = 8, textSize = "text-2xl", hideText = false }: LogoProps) => {
  // Ensure iconSize is a number to prevent Tailwind class issues
  const numericIconSize = typeof iconSize === 'number' ? iconSize : 8;
  
  return (
    <div className={cn("flex items-center gap-2 text-primary overflow-hidden", className)}>
      <Settings className={`h-${numericIconSize} w-${numericIconSize} shrink-0`} strokeWidth={2} />
      {!hideText && <span className={`${textSize} font-bold whitespace-nowrap`}>EquipCare Hub</span>}
    </div>
  );
};

export default Logo;
