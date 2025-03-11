"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMarketplace } from "@/context/marketplace-context"
import { BedDouble, Bath, MapPin, Heart } from "lucide-react"

export default function FeaturedListings() {
  const { favorites, addFavorite, removeFavorite } = useMarketplace()

  // Sample listings data
  const listings = [
    {
      id: 1,
      title: "Modern Studio Apartment",
      location: "Downtown",
      price: 1200,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      beds: 1,
      baths: 1,
      sqft: 550,
    },
    {
      id: 2,
      title: "Spacious 2BR with View",
      location: "Midtown",
      price: 1800,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      beds: 2,
      baths: 1,
      sqft: 850,
    },
    {
      id: 3,
      title: "Cozy 1BR near Park",
      location: "Westside",
      price: 1350,
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      beds: 1,
      baths: 1,
      sqft: 650,
    },
  ]

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Featured Listings</h2>
        <Button variant="link" className="text-vibrant-orange">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <div className="relative">
              <img src={listing.image || "/placeholder.svg"} alt={listing.title} className="w-full h-48 object-cover" />
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 rounded-full"
                onClick={() => toggleFavorite(listing.id)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
                  }`}
                />
              </Button>
              <Badge className="absolute bottom-2 left-2" variant="orange">
                ${listing.price}/mo
              </Badge>
            </div>

            <CardContent className="p-4">
              <h3 className="font-medium mb-1">{listing.title}</h3>
              <div className="flex items-center text-muted-foreground text-sm mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <BedDouble className="h-4 w-4 mr-1 text-vibrant-orange" />
                  <span>
                    {listing.beds} {listing.beds === 1 ? "Bed" : "Beds"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-vibrant-orange" />
                  <span>
                    {listing.baths} {listing.baths === 1 ? "Bath" : "Baths"}
                  </span>
                </div>
                <div>
                  <span>{listing.sqft} sqft</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

