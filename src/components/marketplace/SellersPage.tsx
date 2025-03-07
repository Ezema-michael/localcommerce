import { useState, useEffect } from "react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  StarIcon,
  SearchIcon,
  MapPinIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import SellerRegistration from "./SellerRegistration";
import { toast } from "@/components/ui/use-toast";

interface Seller {
  id: string;
  name: string;
  description: string;
  rating: number;
  profile_image: string;
  location: string;
  contact_email: string;
  contact_phone: string;
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSellerRegistrationOpen, setIsSellerRegistrationOpen] =
    useState(false);
  const [currentSellerId, setCurrentSellerId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSellers() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("sellers")
          .select("*")
          .order("rating", { ascending: false });

        if (error) throw error;

        setSellers(data || []);
        setFilteredSellers(data || []);
      } catch (error) {
        console.error("Error loading sellers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSellers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSellers(sellers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = sellers.filter(
        (seller) =>
          seller.name.toLowerCase().includes(query) ||
          (seller.description &&
            seller.description.toLowerCase().includes(query)) ||
          (seller.location && seller.location.toLowerCase().includes(query)),
      );
      setFilteredSellers(filtered);
    }
  }, [searchQuery, sellers]);

  const handleSellerRegistrationSuccess = (sellerId: string) => {
    setCurrentSellerId(sellerId);
    toast({
      title: "Registration successful",
      description: "Your seller account has been created successfully.",
    });

    // Refresh the sellers list
    supabase
      .from("sellers")
      .select("*")
      .order("rating", { ascending: false })
      .then(({ data }) => {
        if (data) {
          setSellers(data);
          setFilteredSellers(data);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainNavigation
        currentSellerId={currentSellerId}
        onRegisterClick={() => setIsSellerRegistrationOpen(true)}
      />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                Our Sellers
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Discover trusted local sellers in your community. Browse
                profiles, read reviews, and connect with businesses near you.
              </p>
            </div>
            <Button
              onClick={() => setIsSellerRegistrationOpen(true)}
              className="shrink-0"
            >
              Become a Seller
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="relative max-w-md mx-auto">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search sellers by name, description or location..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <Card
                    key={seller.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[3/1] bg-gradient-to-r from-blue-100 to-green-100 relative">
                      {seller.profile_image ? (
                        <img
                          src={seller.profile_image}
                          alt={seller.name}
                          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white object-cover"
                        />
                      ) : (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full border-4 border-white bg-primary/10 flex items-center justify-center">
                          <span className="text-xl font-bold text-primary">
                            {seller.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-12 pb-6 px-6">
                      <div className="text-center mb-4">
                        <h2 className="text-xl font-semibold">{seller.name}</h2>
                        <div className="flex items-center justify-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${i < Math.round(seller.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm ml-2">
                            {seller.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {seller.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {seller.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        {seller.location && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{seller.location}</span>
                          </div>
                        )}
                        {seller.contact_email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MailIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {seller.contact_email}
                            </span>
                          </div>
                        )}
                        {seller.contact_phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{seller.contact_phone}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-lg text-gray-500">
                    No sellers found matching your search criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
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
