"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMarketplace } from "@/context/marketplace-context"
import { MapPin, BedDouble, Bath, Calendar, Star, CheckCircle, Heart, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function SearchPage() {
  const { filteredListings, toggleSaved, searchTerm, setSearchTerm, filterOptions, setFilterOptions } = useMarketplace()
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [sortOption, setSortOption] = useState("relevance")

  // Initialize local filter state from context
  const [localFilterOptions, setLocalFilterOptions] = useState({
    beds: filterOptions.beds ?? null,
    baths: filterOptions.baths ?? null,
    amenities: filterOptions.amenities || [],
  })

  // Sync search term with context when it changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Apply filters from form to context
  const applyFilters = () => {
    setSearchTerm(localSearchTerm)
    setFilterOptions({
      ...localFilterOptions,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    })
  }

  // Toggle amenity in filter
  const toggleAmenity = (amenity: string) => {
    setLocalFilterOptions((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  // Sort listings based on selected option
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "beds":
        return b.beds - a.beds
      case "baths":
        return b.baths - a.baths
      case "newest":
        // In a real app, you would sort by date added
        return b.id - a.id
      default:
        // relevance - in a real app this would be more sophisticated
        return 0
    }
  })

  // Update the search page layout for better responsiveness
  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search location, property type, etc."
              className="pl-9 h-10 sm:h-12 w-full"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters()
                }
              }}
            />
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <Button
              variant="outline"
              className="h-10 sm:h-12 text-xs sm:text-sm flex-1 md:flex-none flex items-center gap-1 sm:gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              Filters
            </Button>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="h-10 sm:h-12 text-xs sm:text-sm flex-1 md:w-[120px] lg:w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="beds">Most Bedrooms</SelectItem>
                <SelectItem value="baths">Most Bathrooms</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="h-10 sm:h-12 text-xs sm:text-sm whitespace-nowrap bg-vibrant-orange hover:bg-orange-600 dark:bg-elegant-orange dark:hover:bg-orange-700"
              onClick={applyFilters}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="w-full mb-3 sm:mb-6">
            <CardContent className="p-3 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Price Range */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Price Range</h3>
                  <div className="space-y-4 sm:space-y-6">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={5000}
                      step={100}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded-md px-2 py-1 text-xs sm:text-sm">${priceRange[0]}</div>
                      <span className="text-xs sm:text-sm text-muted-foreground">to</span>
                      <div className="border rounded-md px-2 py-1 text-xs sm:text-sm">${priceRange[1]}</div>
                    </div>
                  </div>
                </div>

                {/* Beds & Baths */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Bedrooms & Bathrooms</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <Label className="mb-1 sm:mb-2 block text-xs sm:text-sm">Bedrooms</Label>
                      <div className="flex gap-1 sm:gap-2">
                        {["Any", "Studio", "1", "2", "3", "4+"].map((num) => (
                          <Button
                            key={num}
                            variant={
                              localFilterOptions.beds ===
                              (num === "Studio" ? 0 : num === "Any" ? null : Number.parseInt(num))
                                ? "default"
                                : "outline"
                            }
                            className="flex-1 h-7 sm:h-9 text-[10px] sm:text-xs px-1 sm:px-2"
                            onClick={() =>
                              setLocalFilterOptions({
                                ...localFilterOptions,
                                beds: num === "Any" ? null : num === "Studio" ? 0 : Number.parseInt(num),
                              })
                            }
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1 sm:mb-2 block text-xs sm:text-sm">Bathrooms</Label>
                      <div className="flex gap-1 sm:gap-2">
                        {["Any", "1", "1.5", "2", "2.5", "3+"].map((num) => (
                          <Button
                            key={num}
                            variant={
                              localFilterOptions.baths === (num === "Any" ? null : Number.parseFloat(num))
                                ? "default"
                                : "outline"
                            }
                            className="flex-1 h-7 sm:h-9 text-[10px] sm:text-xs px-1 sm:px-2"
                            onClick={() =>
                              setLocalFilterOptions({
                                ...localFilterOptions,
                                baths: num === "Any" ? null : Number.parseFloat(num),
                              })
                            }
                          >
                            {num}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Move-in Date Range */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Move-in Date Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs sm:text-sm whitespace-nowrap">From:</Label>
                      <Input type="date" className="text-xs sm:text-sm" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs sm:text-sm whitespace-nowrap">To:</Label>
                      <Input type="date" className="text-xs sm:text-sm" />
                    </div>
                  </div>
                </div>

                {/* Living Space Type */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Living Space Type</h3>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="space-private" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="space-private" className="text-xs sm:text-sm">
                        Private Room
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="space-shared" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="space-shared" className="text-xs sm:text-sm">
                        Shared Room
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="space-apartment" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="space-apartment" className="text-xs sm:text-sm">
                        Entire Apartment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="space-studio" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="space-studio" className="text-xs sm:text-sm">
                        Studio
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Lifestyle Preferences */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Lifestyle</h3>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="lifestyle-nonsmoker" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="lifestyle-nonsmoker" className="text-xs sm:text-sm">
                        Non-smoker
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="lifestyle-pet" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="lifestyle-pet" className="text-xs sm:text-sm">
                        Pet-friendly
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="lifestyle-early" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="lifestyle-early" className="text-xs sm:text-sm">
                        Early Riser
                      </Label>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox id="lifestyle-night" className="h-3 w-3 sm:h-4 sm:w-4" />
                      <Label htmlFor="lifestyle-night" className="text-xs sm:text-sm">
                        Night Owl
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Cleanliness & Noise */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Cleanliness & Noise</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="mb-1 block text-xs sm:text-sm">Cleanliness</Label>
                      <div className="flex gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] sm:text-xs">
                          Very Clean
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] sm:text-xs">
                          Average
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] sm:text-xs">
                          Relaxed
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="mb-1 block text-xs sm:text-sm">Noise Tolerance</Label>
                      <div className="flex gap-1 sm:gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] sm:text-xs">
                          Very Quiet
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] sm:text-xs">
                          Moderate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] sm:text-xs">
                          Any Noise
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2">
                    {[
                      "WiFi",
                      "Kitchen",
                      "TV",
                      "Parking",
                      "AC",
                      "Backyard",
                      "Elevator",
                      "Rooftop",
                      "Laundry",
                      "Gym",
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-1 sm:space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={localFilterOptions.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                          className="h-3 w-3 sm:h-4 sm:w-4"
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-xs sm:text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t px-3 sm:px-6 py-2 sm:py-4">
              <Button
                variant="outline"
                onClick={() => {
                  setLocalSearchTerm("")
                  setLocalFilterOptions({ beds: null, baths: null, amenities: [] })
                  setPriceRange([0, 5000])
                }}
                className="text-xs sm:text-sm h-8 sm:h-10"
              >
                Reset Filters
              </Button>
              <Button onClick={applyFilters} className="text-xs sm:text-sm h-8 sm:h-10">
                Apply Filters
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <h1 className="text-base sm:text-xl font-bold">
            {sortedListings.length} {sortedListings.length === 1 ? "Result" : "Results"}
            {searchTerm && ` for "${searchTerm}"`}
          </h1>
        </div>

        {/* Listings Grid */}
        {sortedListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedListings.map((listing) => (
              <Card
                key={listing.id}
                className={`overflow-hidden transition-all duration-200 h-full ${hoveredId === listing.id ? "shadow-lg transform -translate-y-1" : "shadow-soft"}`}
                onMouseEnter={() => setHoveredId(listing.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="relative h-40 sm:h-48 w-full">
                  <Link href={`/listing/${listing.id}`}>
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <Badge className="absolute top-3 right-3 bg-vibrant-orange dark:bg-elegant-orange text-xs">
                    ${listing.price}/mo
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 left-3 bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full h-7 w-7 sm:h-8 sm:w-8"
                    onClick={(e) => {
                      e.preventDefault()
                      toggleSaved(listing.id)
                    }}
                  >
                    <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${listing.saved ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                <CardContent className="p-3 sm:p-5">
                  <Link href={`/listing/${listing.id}`}>
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 hover:text-primary transition-colors line-clamp-1">
                      {listing.title}
                    </h3>
                  </Link>

                  <div className="flex items-center text-muted-foreground mb-2 sm:mb-3">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="text-xs sm:text-sm line-clamp-1">{listing.location}</span>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <BedDouble className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
                      <span>
                        {listing.beds} {listing.beds === 1 ? "Bed" : "Beds"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
                      <span>
                        {listing.baths} {listing.baths === 1 ? "Bath" : "Baths"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center mt-2 sm:mt-3 text-xs sm:text-sm">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary" />
                    <span>Available: {listing.available}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-3 sm:p-5 pt-0 border-t">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarImage src={listing.landlord.image} alt={listing.landlord.name} />
                        <AvatarFallback>{listing.landlord.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs sm:text-sm font-medium line-clamp-1">{listing.landlord.name}</p>
                        <div className="flex items-center">
                          <Star className="h-2 w-2 sm:h-3 sm:w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-[10px] sm:text-xs ml-1">{listing.landlord.rating}</span>
                        </div>
                      </div>
                    </div>

                    {listing.verified && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 text-primary border-primary text-[10px] sm:text-xs"
                      >
                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No listings found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-4 sm:mb-6">
              Try adjusting your search or filter criteria to find more listings.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setFilterOptions({
                  minPrice: null,
                  maxPrice: null,
                  beds: null,
                  baths: null,
                  propertyType: null,
                  amenities: [],
                })
              }}
              className="text-xs sm:text-sm"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

