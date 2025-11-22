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
      {/* p-14 = Iso padding joka pitää sisällön poissa jään reunoilta.
         Säädä tätä (p-12, p-14, p-16) jos teksti osuu vielä reunoihin.
      */}
      <div className="relative z-10 flex flex-col items-center text-center w-full h-full justify-between p-14">
        
        {/* Otsikko ylhäällä */}
        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-2 leading-tight">
          {title}
        </h3>
        
        {/* Kuva keskellä/alhaalla */}
        <div className="flex-1 flex items-center justify-center w-full">
          <img 
            src={image} 
            alt={imageAlt} 
            className="max-h-[90px] md:max-h-[110px] w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
          />
        </div>
      </div>
    </motion.div>
  );
};
