import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (params: {
    query: string;
    location: string;
    category: string;
    priceRange: [number, number];
  }) => void;
}

const categories = [
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

const locations = [
  "All Locations",
  "Downtown",
  "Uptown",
  "Westside",
  "Eastside",
  "Northside",
  "Southside",
];

export default function SearchBar({ onSearch = () => {} }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleSearch = () => {
    onSearch({
      query,
      location,
      category,
      priceRange,
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for products or services..."
              className="pl-10 w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
          className="mb-4"
        />
      </div>

      <div className="flex justify-end mt-2">
        <Button
          onClick={handleSearch}
          className="bg-primary hover:bg-primary/90"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
