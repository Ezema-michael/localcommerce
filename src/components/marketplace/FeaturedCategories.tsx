import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  count: number;
  link: string;
}

function CategoryCard({ title, image, count, link }: CategoryCardProps) {
  return (
    <Link to={link} className="group relative overflow-hidden rounded-lg">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-gray-900/0" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-300">{count} items</p>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCategories() {
  const categories = [
    {
      title: "Electronics",
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&q=80",
      count: 128,
      link: "/?category=Electronics",
    },
    {
      title: "Home & Garden",
      image:
        "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&q=80",
      count: 95,
      link: "/?category=Home & Garden",
    },
    {
      title: "Furniture",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      count: 76,
      link: "/?category=Furniture",
    },
    {
      title: "Clothing",
      image:
        "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
      count: 112,
      link: "/?category=Clothing",
    },
    {
      title: "Services",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
      count: 64,
      link: "/?category=Services",
    },
    {
      title: "Books",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
      count: 89,
      link: "/?category=Books",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse Popular Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're
            looking for in your local area.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
