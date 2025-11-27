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
        "relative w-full aspect-square flex flex-col items-center justify-center",
        className
      )}
    >
      {/* Jääkehys päällimmäisenä kerroksena */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url("${cardFrame}")`,
          backgroundSize: '100% 100%'
        }}
      />
      {/* Kuva täyttää koko sisäalueen */}
      <div className="relative z-10 flex flex-col items-center justify-end m-8 md:m-10 w-[calc(100%-4rem)] md:w-[calc(100%-5rem)] h-[calc(100%-4rem)] md:h-[calc(100%-5rem)] overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={imageAlt} 
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover" 
        />
        
        {/* Otsikko alhaalla, tumman gradientin päällä */}
        <div className="relative z-10 w-full bg-gradient-to-t from-black/80 via-black/50 to-transparent py-6 px-4">
          <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};
