import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import cardFrame from "@/assets/BRAIN FREECE CARDS 1.jpg";

interface FrostCardProps {
  title: string;
  image: string;
  imageAlt: string;
  className?: string;
}

export const FrostCard = ({ title, image, imageAlt, className }: FrostCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative w-full aspect-square flex flex-col items-center justify-center bg-center bg-no-repeat",
        className
      )}
      style={{ 
        backgroundImage: `url("${cardFrame}")`,
        backgroundSize: '100% 100%'
      }}
    >
      {/* Läpinäkyvä sisäalue, joka jättää tilaa jääkehykselle */}
      <div className="relative z-10 flex flex-col items-center text-center flex-1 justify-between p-8 m-8 md:m-10 w-[calc(100%-4rem)] md:w-[calc(100%-5rem)]">
        
        {/* Otsikko ylhäällä */}
        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
          {title}
        </h3>
        
        {/* Kuva keskellä/alhaalla - Isompi */}
        <div className="flex-1 flex items-center justify-center w-full">
          <img 
            src={image} 
            alt={imageAlt} 
            loading="eager"
            className="max-h-[180px] md:max-h-[220px] w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
          />
        </div>
      </div>
    </motion.div>
  );
};
