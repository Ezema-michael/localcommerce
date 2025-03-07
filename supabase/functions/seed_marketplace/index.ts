import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      // Supabase API URL - env var exposed by default when deployed
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exposed by default when deployed
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Sample sellers
    const sellers = [
      { name: "John's Electronics", rating: 4.8 },
      { name: "Mary's Handmade", rating: 4.9 },
      { name: "Local Furniture Co.", rating: 4.7 },
      { name: "Tech Repair Services", rating: 4.6 },
      { name: "Vintage Collectibles", rating: 4.5 },
    ];

    // Insert sellers
    const { data: sellersData, error: sellersError } = await supabaseClient
      .from("sellers")
      .upsert(sellers, { onConflict: "name" })
      .select("id, name");

    if (sellersError) throw sellersError;

    // Sample products with their respective sellers
    const products = [
      {
        title: "Vintage Record Player",
        description:
          "A beautiful vintage record player in excellent condition.",
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800&q=80",
        category: "Electronics",
        location: "Downtown",
        seller_id: sellersData.find((s) => s.name === "Vintage Collectibles")
          ?.id,
      },
      {
        title: "Handcrafted Wooden Chair",
        description:
          "Handmade wooden chair crafted from sustainable materials.",
        price: 199.99,
        image:
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
        category: "Furniture",
        location: "Westside",
        seller_id: sellersData.find((s) => s.name === "Local Furniture Co.")
          ?.id,
      },
      {
        title: "Professional Camera Kit",
        description:
          "Complete professional camera kit with lenses and accessories.",
        price: 899.99,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        category: "Electronics",
        location: "Uptown",
        seller_id: sellersData.find((s) => s.name === "John's Electronics")?.id,
      },
      {
        title: "Handmade Ceramic Vase",
        description:
          "Beautiful handcrafted ceramic vase, perfect for any home.",
        price: 59.99,
        image:
          "https://images.unsplash.com/photo-1612196808214-b7e239e5d5e8?w=800&q=80",
        category: "Home & Garden",
        location: "Eastside",
        seller_id: sellersData.find((s) => s.name === "Mary's Handmade")?.id,
      },
      {
        title: "Vintage Leather Jacket",
        description: "Classic vintage leather jacket in excellent condition.",
        price: 129.99,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
        category: "Clothing",
        location: "Downtown",
        seller_id: sellersData.find((s) => s.name === "Vintage Collectibles")
          ?.id,
      },
      {
        title: "Smart Home Hub",
        description: "Control your entire home with this smart home hub.",
        price: 149.99,
        image:
          "https://images.unsplash.com/photo-1558002038-1055e2e28ed1?w=800&q=80",
        category: "Electronics",
        location: "Uptown",
        seller_id: sellersData.find((s) => s.name === "John's Electronics")?.id,
      },
      {
        title: "Handcrafted Jewelry Box",
        description: "Beautiful handmade jewelry box with intricate details.",
        price: 79.99,
        image:
          "https://images.unsplash.com/photo-1616646187794-d3007d1923a8?w=800&q=80",
        category: "Home & Garden",
        location: "Eastside",
        seller_id: sellersData.find((s) => s.name === "Mary's Handmade")?.id,
      },
      {
        title: "Modern Coffee Table",
        description: "Sleek modern coffee table perfect for any living room.",
        price: 249.99,
        image:
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80",
        category: "Furniture",
        location: "Westside",
        seller_id: sellersData.find((s) => s.name === "Local Furniture Co.")
          ?.id,
      },
    ];

    // Insert products
    const { data: productsData, error: productsError } = await supabaseClient
      .from("products")
      .upsert(products, { onConflict: "title" })
      .select("id, title");

    if (productsError) throw productsError;

    // Sample badges
    const badges = [
      {
        product_id: productsData.find(
          (p) => p.title === "Vintage Record Player",
        )?.id,
        badge_type: "top-rated",
      },
      {
        product_id: productsData.find(
          (p) => p.title === "Handcrafted Wooden Chair",
        )?.id,
        badge_type: "quick-response",
      },
      {
        product_id: productsData.find(
          (p) => p.title === "Professional Camera Kit",
        )?.id,
        badge_type: "top-rated",
      },
      {
        product_id: productsData.find(
          (p) => p.title === "Professional Camera Kit",
        )?.id,
        badge_type: "quick-response",
      },
      {
        product_id: productsData.find(
          (p) => p.title === "Handmade Ceramic Vase",
        )?.id,
        badge_type: "recently-added",
      },
      {
        product_id: productsData.find(
          (p) => p.title === "Handmade Ceramic Vase",
        )?.id,
        badge_type: "top-rated",
      },
      {
        product_id: productsData.find((p) => p.title === "Smart Home Hub")?.id,
        badge_type: "recently-added",
      },
    ];

    // Insert badges
    const { error: badgesError } = await supabaseClient
      .from("product_badges")
      .upsert(badges);

    if (badgesError) throw badgesError;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Marketplace data seeded successfully",
        data: {
          sellers: sellersData.length,
          products: productsData.length,
          badges: badges.length,
        },
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
});
