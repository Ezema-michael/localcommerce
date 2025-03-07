import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import FloatingActionButton from "./FloatingActionButton";
import NewListingModal from "./NewListingModal";
import ProductCard, { ProductCardProps } from "./ProductCard";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import SellerRegistration from "./SellerRegistration";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import { Button } from "@/components/ui/button";

// Sample data
const SAMPLE_CATEGORIES = [
  "All Categories",
  "Electronics",
  "Furniture",
  "Clothing",
  "Books",
  "Sports",
  "Home & Garden",
  "Toys",
  "Vehicles",
  "Services",
];

const SAMPLE_LOCATIONS = [
  "All Locations",
  "Downtown",
  "Uptown",
  "Westside",
  "Eastside",
  "Northside",
  "Southside",
];

const SAMPLE_TOP_SELLERS = [
  { id: "1", name: "John's Electronics", rating: 4.8 },
  { id: "2", name: "Mary's Handmade", rating: 4.9 },
  { id: "3", name: "Local Furniture Co.", rating: 4.7 },
  { id: "4", name: "Tech Repair Services", rating: 4.6 },
  { id: "5", name: "Vintage Collectibles", rating: 4.5 },
];

const SAMPLE_PRODUCTS: ProductCardProps[] = [
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
    id: "2",
    title: "Handcrafted Wooden Chair",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
    sellerName: "Local Furniture Co.",
    sellerRating: 4.7,
    badges: ["quick-response"],
    category: "Furniture",
    location: "Westside",
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
    id: "5",
    title: "Vintage Leather Jacket",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    sellerName: "Vintage Collectibles",
    sellerRating: 4.5,
    category: "Clothing",
    location: "Downtown",
  },
  {
    id: "6",
    title: "Smart Home Hub",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1558002038-1055e2e28ed1?w=800&q=80",
    sellerName: "John's Electronics",
    sellerRating: 4.8,
    badges: ["recently-added"],
    category: "Electronics",
    location: "Uptown",
  },
  {
    id: "7",
    title: "Handcrafted Jewelry Box",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1616646187794-d3007d1923a8?w=800&q=80",
    sellerName: "Mary's Handmade",
    sellerRating: 4.9,
    category: "Home & Garden",
    location: "Eastside",
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

export default function MarketplaceLayout() {
  const [products, setProducts] = useState<ProductCardProps[]>(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isSellerRegistrationOpen, setIsSellerRegistrationOpen] =
    useState(false);
  const [currentSellerId, setCurrentSellerId] = useState<string | null>(null);

  const handleSearch = (params: {
    query: string;
    location: string;
    category: string;
    priceRange: [number, number];
  }) => {
    // Filter products based on search parameters
    let filtered = [...SAMPLE_PRODUCTS];

    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.sellerName.toLowerCase().includes(query),
      );
    }

    if (params.location && params.location !== "All Locations") {
      filtered = filtered.filter(
        (product) => product.location === params.location,
      );
    }

    if (params.category && params.category !== "All Categories") {
      filtered = filtered.filter(
        (product) => product.category === params.category,
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= params.priceRange[0] &&
        product.price <= params.priceRange[1],
    );

    setProducts(filtered);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category !== "All Categories") {
      setProducts(
        SAMPLE_PRODUCTS.filter((product) => product.category === category),
      );
    } else {
      setProducts(SAMPLE_PRODUCTS);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    if (location !== "All Locations") {
      setProducts(
        SAMPLE_PRODUCTS.filter((product) => product.location === location),
      );
    } else {
      setProducts(SAMPLE_PRODUCTS);
    }
  };

  const handleNewListing = (data: any) => {
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

    const newProduct: ProductCardProps = {
      id: `${Date.now()}`,
      title: data.title,
      price: data.price,
      image:
        data.image ||
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80",
      sellerName:
        SAMPLE_TOP_SELLERS.find((s) => s.id === currentSellerId)?.name ||
        "Your Business",
      sellerRating: 5.0, // Default for new sellers
      badges: ["recently-added"],
      category: data.category,
      location: data.location,
    };

    setProducts([newProduct, ...products]);

    toast({
      title: "Listing created",
      description:
        "Your product has been successfully listed in the marketplace.",
    });
  };

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
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">
              Local Marketplace
            </h1>
          </div>

          <SearchBar onSearch={handleSearch} />

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <Sidebar
                categories={SAMPLE_CATEGORIES}
                topSellers={SAMPLE_TOP_SELLERS}
                locations={SAMPLE_LOCATIONS}
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                onSelectCategory={handleCategorySelect}
                onSelectLocation={handleLocationSelect}
                onViewTopSeller={(id) => {
                  // Filter to show only products from this seller
                  const seller = SAMPLE_TOP_SELLERS.find((s) => s.id === id);
                  if (seller) {
                    setProducts(
                      SAMPLE_PRODUCTS.filter(
                        (p) => p.sellerName === seller.name,
                      ),
                    );
                  }
                }}
              />
            </div>

            {/* Product Grid */}
            <div className="flex-1">
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
