import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FrostCardProps {
  title: string;
  image: string;
  imageAlt: string;
  className?: string;
  children?: ReactNode;
}

export const FrostCard = ({ title, image, imageAlt, className }: FrostCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 0 50px hsl(190 100% 50% / 0.4)" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "frost-glass relative overflow-visible rounded-2xl p-8 icicle-bottom",
        className
      )}
    >
      <h3 className="mb-6 text-2xl font-bold text-foreground">{title}</h3>
      <div className="flex justify-center">
        <img src={image} alt={imageAlt} className="h-48 w-48 object-contain" />
      </div>
    </motion.div>
  );
};
