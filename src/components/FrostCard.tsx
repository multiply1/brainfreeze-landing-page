import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
// Tarkka tiedostonimi
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
        "relative w-full aspect-square flex flex-col items-center justify-center p-8 md:p-10 bg-center bg-no-repeat bg-contain",
        className
      )}
      // Asetetaan kuva taustaksi
      style={{ backgroundImage: `url("${cardFrame}")` }}
    >
      {/* Kortin sisältö - paddingit estävät sisällön menemisen jään reunojen päälle */}
      <div className="relative z-10 flex flex-col items-center text-center h-full w-full justify-between p-12 md:p-16 gap-6">
        <h3 className="text-lg md:text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(130,240,255,0.8)] mt-2">
          {title}
        </h3>

        <div className="flex-1 flex items-center justify-center w-full">
          <img
            src={image}
            alt={imageAlt}
            className="max-h-[100px] md:max-h-[130px] w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          />
        </div>
      </div>
    </motion.div>
  );
};
