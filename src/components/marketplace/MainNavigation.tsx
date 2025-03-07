import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ShoppingBag,
  User,
  Heart,
  Bell,
  ChevronDown,
  LogOut,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import AuthModal from "../auth/AuthModal";

interface MainNavigationProps {
  currentSellerId?: string | null;
  onRegisterClick: () => void;
}

export default function MainNavigation({
  currentSellerId,
  onRegisterClick,
}: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, sellerId } = useAuth();

  // Use sellerId from auth context if available, otherwise use prop
  const effectiveSellerId = sellerId || currentSellerId;

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo and main navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">LocalMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 h-auto py-2 px-3"
                >
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/?category=Electronics" className="cursor-pointer">
                    Electronics
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/?category=Furniture" className="cursor-pointer">
                    Furniture
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/?category=Clothing" className="cursor-pointer">
                    Clothing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/?category=Books" className="cursor-pointer">
                    Books
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/?category=Services" className="cursor-pointer">
                    Services
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/sellers"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Sellers
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-4">
          {/* Desktop user actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            {user && (
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>My Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/account/profile" className="cursor-pointer">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account/orders" className="cursor-pointer">
                      My Orders
                    </Link>
                  </DropdownMenuItem>

                  {effectiveSellerId ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/seller/dashboard" className="cursor-pointer">
                          Seller Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/listings" className="cursor-pointer">
                          My Listings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/orders" className="cursor-pointer">
                          Seller Orders
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={onRegisterClick}>
                      Become a Seller
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                variant="default"
              >
                Login / Register
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-border">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div className="py-2">
              <div className="font-medium mb-2">Categories</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  to="/?category=Electronics"
                  className="text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Electronics
                </Link>
                <Link
                  to="/?category=Furniture"
                  className="text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Furniture
                </Link>
                <Link
                  to="/?category=Clothing"
                  className="text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Clothing
                </Link>
                <Link
                  to="/?category=Books"
                  className="text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Books
                </Link>
                <Link
                  to="/?category=Services"
                  className="text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
              </div>
            </div>
            <Link
              to="/sellers"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sellers
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {user ? (
              <>
                <div className="py-2">
                  <div className="font-medium mb-2">My Account</div>
                  <div className="pl-4 flex flex-col gap-2">
                    <Link
                      to="/account/profile"
                      className="text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/account/orders"
                      className="text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/favorites"
                      className="text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                    <Link
                      to="/messages"
                      className="text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Messages
                    </Link>
                  </div>
                </div>

                {effectiveSellerId ? (
                  <div className="py-2">
                    <div className="font-medium mb-2">Seller Account</div>
                    <div className="pl-4 flex flex-col gap-2">
                      <Link
                        to="/seller/dashboard"
                        className="text-sm hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/seller/listings"
                        className="text-sm hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Listings
                      </Link>
                      <Link
                        to="/seller/orders"
                        className="text-sm hover:text-primary transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Seller Orders
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      onRegisterClick();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Become a Seller
                  </Button>
                )}

                <Button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="mt-4 justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                variant="default"
                className="mt-2"
              >
                Login / Register
              </Button>
            )}
          </nav>
        </div>
      )}

      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onSuccess={() => {
          // If user successfully logs in and wants to become a seller
          if (!sellerId) {
            onRegisterClick();
          }
        }}
      />
    </header>
  );
}
