import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Hand, Home, Settings, Info } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary/20 glow-primary group-hover:animate-pulse-glow transition-all">
              <Hand className="w-6 h-6 text-secondary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Silent Voices
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                className={isActive("/") ? "glow-primary" : ""}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/interpreter">
              <Button
                variant={isActive("/interpreter") ? "default" : "ghost"}
                className={isActive("/interpreter") ? "glow-primary" : ""}
              >
                <Hand className="w-4 h-4 mr-2" />
                Interpreter
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                className={isActive("/settings") ? "glow-primary" : ""}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant={isActive("/about") ? "default" : "ghost"}
                className={isActive("/about") ? "glow-primary" : ""}
              >
                <Info className="w-4 h-4 mr-2" />
                About
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
