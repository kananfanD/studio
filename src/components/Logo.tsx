
import { HardHat } from 'lucide-react'; // Changed from Settings to HardHat
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  hideText?: boolean; 
}

const Logo = ({ className, iconSize = 8, textSize = "text-2xl", hideText = false }: LogoProps) => {
  const numericIconSize = typeof iconSize === 'number' ? iconSize : 8;
  
  return (
    <div className={cn("flex items-center gap-2 text-primary overflow-hidden", className)}>
      <HardHat className={cn(`h-${numericIconSize} w-${numericIconSize} shrink-0`)} strokeWidth={2.5} />
      {!hideText && <span className={cn(textSize, "font-bold whitespace-nowrap")}>EquipCare Hub</span>}
    </div>
  );
};

export default Logo;

    