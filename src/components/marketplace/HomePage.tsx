import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import FeaturedCategories from "./FeaturedCategories";
import FeaturedProducts from "./FeaturedProducts";
import FeaturedSellers from "./FeaturedSellers";
import TestimonialSection from "./TestimonialSection";
import CtaSection from "./CtaSection";
import { useState } from "react";
import SellerRegistration from "./SellerRegistration";
import { toast } from "@/components/ui/use-toast";

export default function HomePage() {
  const [isSellerRegistrationOpen, setIsSellerRegistrationOpen] =
    useState(false);
  const [currentSellerId, setCurrentSellerId] = useState<string | null>(null);

  const handleSellerRegistrationSuccess = (sellerId: string) => {
    setCurrentSellerId(sellerId);
    toast({
      title: "Registration successful",
      description: "You can now create listings in the marketplace.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainNavigation
        currentSellerId={currentSellerId}
        onRegisterClick={() => setIsSellerRegistrationOpen(true)}
      />

      <main className="flex-grow">
        <HeroSection />
        <FeaturedCategories />
        <FeaturedProducts />
        <FeaturedSellers />
        <TestimonialSection />
        <CtaSection />
      </main>

      <Footer />

      <SellerRegistration
        open={isSellerRegistrationOpen}
        onOpenChange={setIsSellerRegistrationOpen}
        onSuccess={handleSellerRegistrationSuccess}
      />
    </div>
  );
}
