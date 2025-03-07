import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  categories: string[];
  topSellers: {
    id: string;
    name: string;
    rating: number;
    profile_image?: string;
  }[];
  locations: string[];
  selectedCategory?: string;
  selectedLocation?: string;
  onSelectCategory: (category: string) => void;
  onSelectLocation: (location: string) => void;
  onViewTopSeller: (sellerId: string) => void;
  className?: string;
}

export default function Sidebar({
  categories = [],
  topSellers = [],
  locations = [],
  selectedCategory = "",
  selectedLocation = "",
  onSelectCategory = () => {},
  onSelectLocation = () => {},
  onViewTopSeller = () => {},
  className,
}: SidebarProps) {
  return (
    <div className={cn("w-full bg-white rounded-lg shadow-md p-4", className)}>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className="w-full justify-start text-left font-normal"
                onClick={() => onSelectCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="font-semibold mb-3">Top Sellers</h3>
          <div className="space-y-2">
            {topSellers.map((seller) => (
              <Button
                key={seller.id}
                variant="ghost"
                className="w-full justify-start text-left font-normal"
                onClick={() => onViewTopSeller(seller.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    {seller.profile_image ? (
                      <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={seller.profile_image}
                          alt={seller.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-primary font-medium">
                          {seller.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="truncate">{seller.name}</span>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-1.5 py-0.5 rounded flex-shrink-0">
                    {seller.rating.toFixed(1)}★
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="font-semibold mb-3">Locations</h3>
          <div className="space-y-1">
            {locations.map((location) => (
              <Button
                key={location}
                variant={selectedLocation === location ? "default" : "ghost"}
                className="w-full justify-start text-left font-normal"
                onClick={() => onSelectLocation(location)}
              >
                {location}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
