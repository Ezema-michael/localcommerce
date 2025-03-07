import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarIcon, Heart, MessageSquare, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import {
  addToFavorites,
  removeFromFavorites,
  isProductFavorited,
} from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import AuthModal from "../auth/AuthModal";

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  sellerName: string;
  sellerRating: number;
  sellerId?: string;
  sellerImage?: string;
  badges?: Array<"recently-added" | "top-rated" | "quick-response">;
  location?: string;
  category?: string;
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  sellerName,
  sellerRating,
  sellerId,
  sellerImage,
  badges = [],
  location = "Local Area",
  category = "General",
}: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  // Check if product is favorited when user changes
  useState(() => {
    if (user) {
      isProductFavorited(id, user.id).then(setIsFavorited);
    }
  }, [id, user]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(id, user.id);
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "The product has been removed from your favorites.",
        });
      } else {
        await addToFavorites(id, user.id);
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "The product has been added to your favorites.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "There was a problem updating your favorites.",
        variant: "destructive",
      });
    }
  };
  return (
    <Link to={`/product/${id}`} className="block">
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg bg-white h-full">
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={
                image ||
                "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
              }
              alt={title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-sm"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </Button>
          </div>
          {badges && badges.length > 0 && (
            <div className="absolute top-2 left-2 flex flex-wrap gap-1">
              {badges.includes("recently-added") && (
                <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
              )}
              {badges.includes("top-rated") && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  Top Rated
                </Badge>
              )}
              {badges.includes("quick-response") && (
                <Badge className="bg-purple-500 hover:bg-purple-600">
                  Quick Response
                </Badge>
              )}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <span className="font-bold text-lg">${price.toFixed(2)}</span>
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <span>{category}</span>
              <span className="mx-1">•</span>
              <span>{location}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {sellerImage ? (
              <div className="h-6 w-6 rounded-full overflow-hidden">
                <img
                  src={sellerImage}
                  alt={sellerName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-medium">
                  {sellerName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm font-medium">{sellerName}</span>
            <div className="flex items-center ml-auto">
              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{sellerRating.toFixed(1)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 gap-2">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/product/${id}`;
            }}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!user) {
                setIsAuthModalOpen(true);
                return;
              }
              if (sellerId) {
                window.location.href = `/messages?seller=${sellerId}&product=${id}`;
              }
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to cart logic
              toast({
                title: "Added to cart",
                description: "The product has been added to your cart.",
              });
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </CardFooter>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
      </Card>

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </Link>
  );
}
