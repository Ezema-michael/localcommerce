import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-green-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.5))] bg-grid-slate-200/[0.2]" />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              Discover Local <span className="text-primary">Treasures</span> in
              Your Community
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Connect with trusted local sellers, find unique products, and
              support your community's economy.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/sellers">
                  Browse Sellers <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/?category=Electronics">Explore Products</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=800&q=80"
                  alt="Handcrafted items"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-4/5 h-4/5 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800&q=80"
                  alt="Vintage record player"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full bg-primary/10 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="text-primary font-bold text-xl">Local</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
