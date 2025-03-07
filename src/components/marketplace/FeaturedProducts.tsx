import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featuredProducts = [
    {
      id: "1",
      title: "Vintage Record Player",
      price: 149.99,
      image:
        "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800&q=80",
      sellerName: "Vintage Collectibles",
      sellerRating: 4.5,
      badges: ["top-rated"],
      category: "Electronics",
      location: "Downtown",
    },
    {
      id: "4",
      title: "Handmade Ceramic Vase",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=800&q=80",
      sellerName: "Mary's Handmade",
      sellerRating: 4.9,
      badges: ["recently-added", "top-rated"],
      category: "Home & Garden",
      location: "Eastside",
    },
    {
      id: "3",
      title: "Professional Camera Kit",
      price: 899.99,
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
      sellerName: "John's Electronics",
      sellerRating: 4.8,
      badges: ["top-rated", "quick-response"],
      category: "Electronics",
      location: "Uptown",
    },
    {
      id: "8",
      title: "Modern Coffee Table",
      price: 249.99,
      image:
        "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
      sellerName: "Local Furniture Co.",
      sellerRating: 4.7,
      category: "Furniture",
      location: "Westside",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover unique items from local sellers in your community.
            </p>
          </div>
          <Button variant="ghost" className="flex items-center gap-1" asChild>
            <Link to="/">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}
