import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Clock, 
  BookOpen, 
  Bookmark, 
  MapPin, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { t, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: t("home"), icon: Home },
    { path: "/deadlines", label: t("deadlines"), icon: Clock },
    { path: "/schemes", label: t("schemes"), icon: BookOpen },
    { path: "/bookmarks", label: t("bookmarks"), icon: Bookmark },
    { path: "/offices", label: t("offices"), icon: MapPin },
    { path: "/settings", label: t("settings"), icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-bold text-primary">{t("appName")}</h1>
            <p className="text-xs text-muted-foreground mt-1">{t("tagline")}</p>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <Link 
              to="/profile" 
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-primary p-1">
                {t("edit")}
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {item.label}
                    {isActive(item.path) && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate("/");
              }}
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
