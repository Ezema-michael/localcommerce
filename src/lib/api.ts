import { supabase } from "./supabase";
import { ProductCardProps } from "@/components/marketplace/ProductCard";

// Get all products
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      title,
      price,
      image,
      category,
      location,
      sellers(id, name, rating, profile_image)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

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
            b.badge_type as "recently-added" | "top-rated" | "quick-response",
        ) || [];

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        sellerName: product.sellers?.name || "Unknown Seller",
        sellerRating: product.sellers?.rating || 5.0,
        sellerId: product.sellers?.id,
        sellerImage: product.sellers?.profile_image,
        badges,
        category: product.category,
        location: product.location,
      } as ProductCardProps;
    }),
  );

  return productsWithBadges;
}

// Get product by ID
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      sellers(id, name, rating, profile_image, description, contact_email, contact_phone, location)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }

  // Get badges
  const { data: badgesData } = await supabase
    .from("product_badges")
    .select("badge_type")
    .eq("product_id", id);

  const badges =
    badgesData?.map(
      (b) => b.badge_type as "recently-added" | "top-rated" | "quick-response",
    ) || [];

  // Get reviews
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", id);

  return {
    ...data,
    badges,
    reviews: reviewsData || [],
  };
}

// Get all categories
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("name")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return ["All Categories", ...data.map((c) => c.name)];
}

// Get all locations
export async function getLocations() {
  const { data, error } = await supabase
    .from("locations")
    .select("name")
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error);
    return [];
  }

  return ["All Locations", ...data.map((l) => l.name)];
}

// Get top sellers
export async function getTopSellers() {
  const { data, error } = await supabase
    .from("sellers")
    .select("id, name, rating, profile_image, description")
    .order("rating", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching top sellers:", error);
    return [];
  }

  return data;
}

// Register a new seller
export async function registerSeller(seller: {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  location: string;
  profile_image?: string;
  user_id: string;
}) {
  const { data, error } = await supabase
    .from("sellers")
    .insert({
      name: seller.name,
      description: seller.description,
      contact_email: seller.contact_email,
      contact_phone: seller.contact_phone,
      location: seller.location,
      profile_image: seller.profile_image,
      rating: 5.0, // Default rating for new sellers
      user_id: seller.user_id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error registering seller:", error);
    return null;
  }

  return data.id;
}

// Get seller by ID
export async function getSellerById(id: string) {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching seller:", error);
    return null;
  }

  return data;
}

// Get seller by user ID
export async function getSellerByUserId(userId: string) {
  const { data, error } = await supabase
    .from("sellers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error fetching seller by user ID:", error);
  }

  return data || null;
}

// Add a new product
export async function addProduct(product: {
  title: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  location: string;
  seller_id: string;
}) {
  // Insert the product
  const { data, error } = await supabase
    .from("products")
    .insert({
      title: product.title,
      description: product.description,
      price: product.price,
      image:
        product.image ||
        "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=80",
      category: product.category,
      location: product.location,
      seller_id: product.seller_id,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error adding product:", error);
    return null;
  }

  // Add the "recently-added" badge
  const { error: badgeError } = await supabase.from("product_badges").insert({
    product_id: data.id,
    badge_type: "recently-added",
  });

  if (badgeError) {
    console.error("Error adding badge:", badgeError);
  }

  return data.id;
}

// Update a product
export async function updateProduct(
  id: string,
  updates: {
    title?: string;
    description?: string;
    price?: number;
    image?: string;
    category?: string;
    location?: string;
  },
) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return null;
  }

  return data;
}

// Delete a product
export async function deleteProduct(id: string) {
  // First delete any badges associated with the product
  const { error: badgeError } = await supabase
    .from("product_badges")
    .delete()
    .eq("product_id", id);

  if (badgeError) {
    console.error("Error deleting product badges:", badgeError);
  }

  // Then delete the product
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return false;
  }

  return true;
}

// Search products
export async function searchProducts(params: {
  query?: string;
  location?: string;
  category?: string;
  priceRange?: [number, number];
  sellerId?: string;
}) {
  let query = supabase.from("products").select(`
      id,
      title,
      price,
      image,
      category,
      location,
      sellers(id, name, rating, profile_image)
    `);

  // Apply filters
  if (params.query) {
    query = query.or(
      `title.ilike.%${params.query}%,description.ilike.%${params.query}%`,
    );
  }

  if (params.location && params.location !== "All Locations") {
    query = query.eq("location", params.location);
  }

  if (params.category && params.category !== "All Categories") {
    query = query.eq("category", params.category);
  }

  if (params.priceRange) {
    query = query
      .gte("price", params.priceRange[0])
      .lte("price", params.priceRange[1]);
  }

  if (params.sellerId) {
    query = query.eq("seller_id", params.sellerId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching products:", error);
    return [];
  }

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
            b.badge_type as "recently-added" | "top-rated" | "quick-response",
        ) || [];

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        sellerName: product.sellers?.name || "Unknown Seller",
        sellerRating: product.sellers?.rating || 5.0,
        sellerId: product.sellers?.id,
        sellerImage: product.sellers?.profile_image,
        badges,
        category: product.category,
        location: product.location,
      } as ProductCardProps;
    }),
  );

  return productsWithBadges;
}

// Add a product to favorites
export async function addToFavorites(productId: string, userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .insert({
      product_id: productId,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding to favorites:", error);
    return null;
  }

  return data;
}

// Remove a product from favorites
export async function removeFromFavorites(productId: string, userId: string) {
  const { error } = await supabase
    .from("favorites")
    .delete()
    .match({ product_id: productId, user_id: userId });

  if (error) {
    console.error("Error removing from favorites:", error);
    return false;
  }

  return true;
}

// Get user's favorites
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      id,
      product_id,
      products(id, title, price, image, category, location, seller_id, sellers(id, name, rating, profile_image))
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  // Get badges for each product
  const favoritesWithBadges = await Promise.all(
    data.map(async (favorite) => {
      const product = favorite.products;
      const { data: badgesData } = await supabase
        .from("product_badges")
        .select("badge_type")
        .eq("product_id", product.id);

      const badges =
        badgesData?.map(
          (b) =>
            b.badge_type as "recently-added" | "top-rated" | "quick-response",
        ) || [];

      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        sellerName: product.sellers?.name || "Unknown Seller",
        sellerRating: product.sellers?.rating || 5.0,
        sellerId: product.sellers?.id,
        sellerImage: product.sellers?.profile_image,
        badges,
        category: product.category,
        location: product.location,
        favoriteId: favorite.id,
      } as ProductCardProps & { favoriteId: string };
    }),
  );

  return favoritesWithBadges;
}

// Check if a product is in user's favorites
export async function isProductFavorited(productId: string, userId: string) {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .match({ product_id: productId, user_id: userId });

  if (error) {
    console.error("Error checking if product is favorited:", error);
    return false;
  }

  return data.length > 0;
}

// Add a review to a product
export async function addReview(review: {
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
}) {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: review.productId,
      user_id: review.userId,
      rating: review.rating,
      comment: review.comment,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding review:", error);
    return null;
  }

  // If rating is 5, add top-rated badge if it doesn't exist
  if (review.rating === 5) {
    const { data: badgeData } = await supabase
      .from("product_badges")
      .select("id")
      .match({ product_id: review.productId, badge_type: "top-rated" });

    if (!badgeData || badgeData.length === 0) {
      await supabase.from("product_badges").insert({
        product_id: review.productId,
        badge_type: "top-rated",
      });
    }
  }

  return data;
}

// Get reviews for a product
export async function getProductReviews(productId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      `
      *,
      profiles:auth.users(id, email)
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return data;
}

// Send a message
export async function sendMessage(message: {
  senderId: string;
  recipientId: string;
  productId?: string;
  message: string;
}) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: message.senderId,
      recipient_id: message.recipientId,
      product_id: message.productId,
      message: message.message,
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return null;
  }

  return data;
}

// Get user's messages
export async function getUserMessages(userId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:auth.users(id, email),
      recipient:auth.users(id, email),
      product:products(id, title, image)
    `,
    )
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

// Create an order
export async function createOrder(order: {
  buyerId: string;
  sellerId: string;
  totalAmount: number;
  shippingAddress?: string;
  contactPhone?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}) {
  // Start a transaction
  const { data, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: order.buyerId,
      seller_id: order.sellerId,
      total_amount: order.totalAmount,
      shipping_address: order.shippingAddress,
      contact_phone: order.contactPhone,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating order:", error);
    return null;
  }

  // Add order items
  const orderItems = order.items.map((item) => ({
    order_id: data.id,
    product_id: item.productId,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error adding order items:", itemsError);
    // Ideally we would roll back the transaction here
    return null;
  }

  return data;
}

// Get user's orders
export async function getUserOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      seller:sellers(id, name, profile_image),
      items:order_items(id, quantity, price, product:products(id, title, image))
    `,
    )
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }

  return data;
}

// Get seller's orders
export async function getSellerOrders(sellerId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      buyer:auth.users(id, email),
      items:order_items(id, quantity, price, product:products(id, title, image))
    `,
    )
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching seller orders:", error);
    return [];
  }

  return data;
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date() })
    .eq("id", orderId)
    .select()
    .single();

  if (error) {
    console.error("Error updating order status:", error);
    return null;
  }

  return data;
}

// Save search history
export async function saveSearchHistory(search: {
  userId: string;
  query: string;
  category?: string;
  location?: string;
}) {
  const { error } = await supabase.from("search_history").insert({
    user_id: search.userId,
    query: search.query,
    category: search.category,
    location: search.location,
  });

  if (error) {
    console.error("Error saving search history:", error);
    return false;
  }

  return true;
}

// Get recommended products based on user's search history
export async function getRecommendedProducts(userId: string) {
  // Get user's recent searches
  const { data: searchHistory, error: searchError } = await supabase
    .from("search_history")
    .select("query, category, location")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (searchError) {
    console.error("Error fetching search history:", searchError);
    return [];
  }

  if (!searchHistory || searchHistory.length === 0) {
    // If no search history, return top-rated products
    return searchProducts({ category: "All Categories" });
  }

  // Extract most common categories and locations
  const categories = searchHistory
    .filter((s) => s.category)
    .map((s) => s.category);
  const locations = searchHistory
    .filter((s) => s.location)
    .map((s) => s.location);

  const mostCommonCategory =
    categories.length > 0
      ? categories.sort(
          (a, b) =>
            categories.filter((c) => c === a).length -
            categories.filter((c) => c === b).length,
        )[0]
      : null;

  const mostCommonLocation =
    locations.length > 0
      ? locations.sort(
          (a, b) =>
            locations.filter((l) => l === a).length -
            locations.filter((l) => l === b).length,
        )[0]
      : null;

  // Get products matching user's interests
  return searchProducts({
    category: mostCommonCategory,
    location: mostCommonLocation,
  });
}
