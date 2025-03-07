import { Card, CardContent } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SellerCardProps {
  id: string;
  name: string;
  image?: string;
  rating: number;
  description: string;
  productCount: number;
}

function SellerCard({
  id,
  name,
  image,
  rating,
  description,
  productCount,
}: SellerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 bg-gradient-to-r from-blue-100 to-green-100 relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover"
          />
        ) : (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <CardContent className="pt-12 pb-6 px-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center justify-center mt-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm ml-2">{rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{productCount} products</p>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <Button variant="outline" className="w-full" asChild>
          <Link to={`/?seller=${id}`}>View Products</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function FeaturedSellers() {
  const sellers = [
    {
      id: "1",
      name: "John's Electronics",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
      rating: 4.8,
      description:
        "Specializing in vintage electronics and audio equipment with expert repair services.",
      productCount: 24,
    },
    {
      id: "2",
      name: "Mary's Handmade",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80",
      rating: 4.9,
      description:
        "Handcrafted ceramics, textiles, and home decor made with sustainable materials.",
      productCount: 36,
    },
    {
      id: "3",
      name: "Local Furniture Co.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
      rating: 4.7,
      description:
        "Custom-built furniture using locally sourced wood and eco-friendly finishes.",
      productCount: 18,
    },
    {
      id: "4",
      name: "Vintage Collectibles",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
      rating: 4.5,
      description:
        "Curated collection of vintage clothing, accessories, and rare collectibles.",
      productCount: 42,
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Top Sellers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover trusted local businesses with exceptional products and
            services in your community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sellers.map((seller) => (
            <SellerCard key={seller.id} {...seller} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/sellers">View All Sellers</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
