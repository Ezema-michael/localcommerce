import { useEffect, useState } from "react";
import FloatingActionButton from "./FloatingActionButton";
import NewListingModal from "./NewListingModal";
import ProductCard, { ProductCardProps } from "./ProductCard";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SellerRegistration from "./SellerRegistration";
import {
  addProduct,
  getCategories,
  getLocations,
  getProducts,
  getTopSellers,
  searchProducts,
  registerSeller,
} from "@/lib/api";
import { supabase } from "@/lib/supabase";

export default function MarketplaceWithAPI() {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [topSellers, setTopSellers] = useState<
    { id: string; name: string; rating: number }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isSellerRegistrationOpen, setIsSellerRegistrationOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSellerId, setCurrentSellerId] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [productsData, categoriesData, locationsData, topSellersData] =
          await Promise.all([
            getProducts(),
            getCategories(),
            getLocations(),
            getTopSellers(),
          ]);

        setProducts(productsData);
        setCategories(categoriesData);
        setLocations(locationsData);
        setTopSellers(topSellersData);
      } catch (error) {
        console.error("Error loading marketplace data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    // Set up realtime subscription for products
    const productsSubscription = supabase
      .channel("public:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          // Refresh products when changes occur
          getProducts().then(setProducts);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productsSubscription);
    };
  }, []);

  const handleSearch = async (params: {
    query: string;
    location: string;
    category: string;
    priceRange: [number, number];
  }) => {
    setIsLoading(true);
    try {
      const results = await searchProducts(params);
      setProducts(results);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setIsLoading(true);
    try {
      const results = await searchProducts({ category });
      setProducts(results);
    } catch (error) {
      console.error("Error filtering by category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = async (location: string) => {
    setSelectedLocation(location);
    setIsLoading(true);
    try {
      const results = await searchProducts({ location });
      setProducts(results);
    } catch (error) {
      console.error("Error filtering by location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewListing = async (data: {
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    image?: string;
  }) => {
    // Check if user is registered as a seller
    if (!currentSellerId) {
      toast({
        title: "Seller registration required",
        description:
          "You need to register as a seller before creating listings.",
        variant: "destructive",
      });
      setIsSellerRegistrationOpen(true);
      return;
    }

    try {
      const productId = await addProduct({
        ...data,
        seller_id: currentSellerId,
      });

      if (productId) {
        toast({
          title: "Listing created",
          description:
            "Your product has been successfully listed in the marketplace.",
        });
      }

      // Refresh products
      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error adding new listing:", error);
      toast({
        title: "Error",
        description:
          "There was a problem creating your listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSellerRegistrationSuccess = (sellerId: string) => {
    setCurrentSellerId(sellerId);
    toast({
      title: "Registration successful",
      description: "You can now create listings in the marketplace.",
    });
  };

  const handleSeedData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-seed-marketplace",
      );

      if (error) {
        console.error("Error seeding data:", error);
        return;
      }

      console.log("Seed result:", data);

      // Refresh all data
      const [productsData, categoriesData, locationsData, topSellersData] =
        await Promise.all([
          getProducts(),
          getCategories(),
          getLocations(),
          getTopSellers(),
        ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setLocations(locationsData);
      setTopSellers(topSellersData);
    } catch (error) {
      console.error("Error seeding marketplace data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainNavigation
        currentSellerId={currentSellerId}
        onRegisterClick={() => setIsSellerRegistrationOpen(true)}
      />
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">
              Local Marketplace
            </h1>
            <div className="flex gap-2 ml-auto">
              <Button onClick={handleSeedData} variant="outline">
                Seed Sample Data
              </Button>
            </div>
          </div>

          <SearchBar onSearch={handleSearch} />

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <Sidebar
                categories={categories}
                topSellers={topSellers}
                locations={locations}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                onSelectCategory={handleCategorySelect}
                onSelectLocation={handleLocationSelect}
                onViewTopSeller={async (id) => {
                  // Filter to show only products from this seller
                  setIsLoading(true);
                  try {
                    const seller = topSellers.find((s) => s.id === id);
                    if (seller) {
                      const { data } = await supabase
                        .from("products")
                        .select(
                          `
                        id,
                        title,
                        price,
                        image,
                        category,
                        location,
                        sellers(name, rating)
                      `,
                        )
                        .eq("seller_id", id);

                      if (data) {
                        // Get badges for each product
                        const productsWithBadges = await Promise.all(
                          data.map(async (product) => {
                            const { data: badgesData } = await supabase
                              .from("product_badges")
                              .select("badge_type")
                              .eq("product_id", product.id);

                            const badges =
                              badgesData?.map(
                                (b) =>
                                  b.badge_type as
                                    | "recently-added"
                                    | "top-rated"
                                    | "quick-response",
                              ) || [];

                            return {
                              id: product.id,
                              title: product.title,
                              price: product.price,
                              image: product.image,
                              sellerName:
                                product.sellers?.name || "Unknown Seller",
                              sellerRating: product.sellers?.rating || 5.0,
                              badges,
                              category: product.category,
                              location: product.location,
                            } as ProductCardProps;
                          }),
                        );

                        setProducts(productsWithBadges);
                      }
                    }
                  } catch (error) {
                    console.error("Error filtering by seller:", error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-lg text-gray-500">
                        No products found matching your criteria.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <FloatingActionButton onClick={() => setIsNewListingModalOpen(true)} />

      <NewListingModal
        open={isNewListingModalOpen}
        onOpenChange={setIsNewListingModalOpen}
        onSubmit={handleNewListing}
      />

      <SellerRegistration
        open={isSellerRegistrationOpen}
        onOpenChange={setIsSellerRegistrationOpen}
        onSuccess={handleSellerRegistrationSuccess}
      />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
