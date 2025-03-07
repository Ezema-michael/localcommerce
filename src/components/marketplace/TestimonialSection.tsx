import { Card, CardContent } from "@/components/ui/card";
import { StarIcon, Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image: string;
  rating: number;
}

function Testimonial({ quote, author, role, image, rating }: TestimonialProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="mb-4">
          <Quote className="h-8 w-8 text-primary/20" />
        </div>
        <p className="text-gray-700 mb-6 flex-grow">{quote}</p>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img
              src={image}
              alt={author}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium">{author}</h4>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
          <div className="ml-auto flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialSection() {
  const testimonials = [
    {
      quote:
        "I've been selling my handmade ceramics on LocalMarket for six months now, and I've connected with so many customers in my area. The platform is easy to use and has helped my small business grow tremendously.",
      author: "Sarah Johnson",
      role: "Seller",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80",
      rating: 5,
    },
    {
      quote:
        "As someone who prefers to shop locally, LocalMarket has been a game-changer. I've discovered amazing products from sellers just minutes away from my home that I never knew existed before.",
      author: "Michael Chen",
      role: "Buyer",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80",
      rating: 5,
    },
    {
      quote:
        "The quality of items I've purchased through LocalMarket has been consistently excellent. I love being able to message sellers directly and sometimes even pick up my purchases in person.",
      author: "Emma Rodriguez",
      role: "Buyer",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80",
      rating: 4,
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Community Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from buyers and sellers who are part of our growing local
            marketplace community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
}
