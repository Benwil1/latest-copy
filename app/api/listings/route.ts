import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ListingModel, { IListing } from '@/models/Listing';
import UserModel from '@/models/User'; // To verify user exists if needed
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

// Create a new listing
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    let decodedPayload;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decodedPayload = payload;
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    const authenticatedUserId = decodedPayload.userId as string;

    await dbConnect();

    const body = await req.json();
    const {
        title,
        description,
        price,
        location,
        images,
        roomType,
        bedrooms,
        bathrooms,
        areaSqFt,
        amenities,
        availabilityDate,
        leaseTerms,
        rules
    }: Partial<IListing> = body;

    if (!title || !description || !price || !location || !roomType || !availabilityDate) {
      return NextResponse.json(
        { success: false, message: 'Missing required listing fields' },
        { status: 400 }
      );
    }

    // Validate location object
    if (!location.address || !location.city || !location.zipCode) {
        return NextResponse.json(
            { success: false, message: 'Location must include address, city, and zipCode' },
            { status: 400 }
          );
    }


    const newListing = new ListingModel({
      createdBy: authenticatedUserId,
      title,
      description,
      price,
      location,
      images: images && images.length > 0 ? images : undefined, // Use default from schema if not provided
      roomType,
      bedrooms,
      bathrooms,
      areaSqFt,
      amenities,
      availabilityDate: new Date(availabilityDate), // Ensure it's a Date object
      leaseTerms,
      rules,
      isVerified: false, // Listings start as unverified
    });

    await newListing.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Listing created successfully',
        data: newListing,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create Listing Error:', error);
    if (error.name === 'ValidationError') {
      let errors: { [key: string]: string } = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return NextResponse.json(
        { success: false, message: 'Validation Error', errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// Get all listings (with optional filters)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const roomTypeFilter = searchParams.get('roomType');
    const cityFilter = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    // Add more filters as needed: amenities, bedrooms, etc.

    const query: any = {};

    if (roomTypeFilter) {
      query.roomType = roomTypeFilter;
    }
    if (cityFilter) {
      query['location.city'] = { $regex: new RegExp(cityFilter, 'i') }; // Case-insensitive search
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice, 10);
      if (maxPrice) query.price.$lte = parseInt(maxPrice, 10);
    }

    const skip = (page - 1) * limit;

    const listings = await ListingModel.find(query)
      .populate('createdBy', 'name profilePicture email') // Populate creator info
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    const totalListings = await ListingModel.countDocuments(query);
    const totalPages = Math.ceil(totalListings / limit);

    return NextResponse.json(
      {
        success: true,
        data: listings,
        pagination: {
          currentPage: page,
          totalPages,
          totalListings,
          limit,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Get Listings Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
