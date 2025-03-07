import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  MessageSquare,
  ShoppingCart,
  Star,
  Share2,
  MapPin,
  Mail,
  Phone,
  ChevronLeft,
  Plus,
  Minus,
} from "lucide-react";
import MainNavigation from "./MainNavigation";
import Footer from "./Footer";
import {
  getProductById,
  isProductFavorited,
  addToFavorites,
  removeFromFavorites,
  addReview,
} from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import AuthModal from "../auth/AuthModal";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (user && product) {
      isProductFavorited(product.id, user.id).then(setIsFavorited);
    }
  }, [product, user]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id!);
      if (data) {
        setProduct(data);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(product.id, user.id);
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "The product has been removed from your favorites.",
        });
      } else {
        await addToFavorites(product.id, user.id);
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingReview(true);
    try {
      await addReview({
        productId: product.id,
        userId: user.id,
        rating: reviewRating,
        comment: reviewComment,
      });

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      // Reload product to get updated reviews
      loadProduct();
      setReviewComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your review.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MainNavigation onRegisterClick={() => setIsAuthModalOpen(true)} />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MainNavigation onRegisterClick={() => setIsAuthModalOpen(true)} />
        <main className="flex-grow">
          <div className="container mx-auto py-12 px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/">Return to Homepage</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const seller = product.sellers;
  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0,
        ) / product.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MainNavigation onRegisterClick={() => setIsAuthModalOpen(true)} />
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/" className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Products
              </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="aspect-square relative">
                  <img
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {product.badges && product.badges.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {product.badges.includes("recently-added") && (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          New
                        </Badge>
                      )}
                      {product.badges.includes("top-rated") && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Top Rated
                        </Badge>
                      )}
                      {product.badges.includes("quick-response") && (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                          Quick Response
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 font-medium">
                      {averageRating ? averageRating.toFixed(1) : "No reviews"}
                    </span>
                    <span className="ml-1 text-gray-500">
                      ({product.reviews ? product.reviews.length : 0} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>{product.category}</span>
                    <span className="mx-1">•</span>
                    <span>{product.location}</span>
                  </div>
                </div>

                <div className="text-2xl font-bold text-primary mb-4">
                  ${product.price.toFixed(2)}
                </div>

                <p className="text-gray-700 mb-6">{product.description}</p>

                {/* Seller Info */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    {seller.profile_image ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={seller.profile_image}
                          alt={seller.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {seller.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{seller.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">
                          {seller.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      asChild
                    >
                      <Link to={`/seller/${seller.id}`}>View Profile</Link>
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {seller.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{seller.location}</span>
                      </div>
                    )}
                    {seller.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{seller.contact_email}</span>
                      </div>
                    )}
                    {seller.contact_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{seller.contact_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-md"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <div className="h-8 px-4 flex items-center justify-center border-y border-input">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-md"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="flex-1 min-w-[120px]">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 min-w-[120px]"
                    onClick={handleFavoriteToggle}
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {isFavorited ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <Tabs defaultValue="description">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <div className="prose max-w-none">
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Product Details</h3>
                      <ul className="space-y-2">
                        <li className="flex">
                          <span className="font-medium w-32">Category:</span>
                          <span>{product.category}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">Location:</span>
                          <span>{product.location}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">Seller:</span>
                          <span>{seller.name}</span>
                        </li>
                        <li className="flex">
                          <span className="font-medium w-32">Listed:</span>
                          <span>
                            {new Date(product.created_at).toLocaleDateString()}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Shipping & Returns</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>Free local pickup available</li>
                        <li>Shipping available within 10 miles</li>
                        <li>Returns accepted within 7 days</li>
                        <li>Contact seller for shipping rates</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <div className="space-y-6">
                    {/* Review Form */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Write a Review</h3>
                      <form onSubmit={handleSubmitReview}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setReviewRating(rating)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-6 w-6 ${reviewRating >= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">
                            Comment
                          </label>
                          <Textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            className="w-full"
                            rows={4}
                          />
                        </div>
                        <Button type="submit" disabled={isSubmittingReview}>
                          {isSubmittingReview
                            ? "Submitting..."
                            : "Submit Review"}
                        </Button>
                      </form>
                    </div>

                    <Separator />

                    {/* Reviews List */}
                    <div>
                      <h3 className="font-semibold mb-4">Customer Reviews</h3>
                      {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-4">
                          {product.reviews.map((review: any) => (
                            <div
                              key={review.id}
                              className="bg-white p-4 rounded-lg border border-gray-100"
                            >
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">
                                      {review.user_id
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium">User</div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(
                                        review.created_at,
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.comment && (
                                <p className="text-gray-700">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No reviews yet. Be the first to review this product!
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
    </div>
  );
}
