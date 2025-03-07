import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <div className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Join Our Local Marketplace?
        </h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8 text-lg">
          Whether you're looking to buy unique products or sell your own
          creations, LocalMarket connects you with your community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/sellers">Browse Sellers</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white border-white hover:bg-white/10"
            asChild
          >
            <Link
              to="#"
              onClick={(e) => {
                e.preventDefault();
                // This would trigger the seller registration modal
                // For now we'll just alert
                alert("This would open the seller registration modal");
              }}
            >
              Become a Seller
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
