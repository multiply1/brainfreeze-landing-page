import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Navbar = () => {
  return (
    <nav className="frost-glass fixed left-1/2 top-8 z-50 flex -translate-x-1/2 transform items-center gap-8 rounded-full px-8 py-4 icicle-bottom">
      <div className="flex items-center gap-3">
        <img src={logo} alt="BrainFreeze Logo" className="h-10 w-10" />
        <span className="text-xl font-bold text-foreground">BrainFreeze</span>
      </div>
      
      <div className="flex items-center gap-6">
        <a href="#home" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
          Home
        </a>
        <a href="#about" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
          About
        </a>
        <a href="#services" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
          Services
        </a>
        <a href="#contact" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
          Contact
        </a>
      </div>

      <Button variant="frozen" size="default" className="icicle-bottom">
        DOWNLOAD NOW
      </Button>
    </nav>
  );
};
