import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ListingModel, { IListing } from '@/models/Listing';
import { jwtVerify } from 'jose';

const JWT_SECRET_RAW = process.env.JWT_SECRET;
if (!JWT_SECRET_RAW) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_RAW);

interface RequestContext {
  params: {
    id: string;
  };
}

// Get a single listing by ID
export async function GET(req: NextRequest, { params }: RequestContext) {
  try {
    const { id } = params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid listing ID format' }, { status: 400 });
    }

    await dbConnect();

    const listing = await ListingModel.findById(id).populate(
      'createdBy',
      'name email profilePicture' // Select fields from User
    );

    if (!listing) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: listing }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching listing ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// Update a listing by ID
export async function PUT(req: NextRequest, { params }: RequestContext) {
  try {
    const { id } = params; // ID of the listing to update

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid listing ID format' }, { status: 400 });
    }

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

    const listingToUpdate = await ListingModel.findById(id);
    if (!listingToUpdate) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    // Check if the authenticated user is the creator of the listing
    if (listingToUpdate.createdBy.toString() !== authenticatedUserId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: You can only update your own listings' },
        { status: 403 }
      );
    }

    const body = await req.json();
    // Destructure allowed fields to update
    const {
        title, description, price, location, images, roomType,
        bedrooms, bathrooms, areaSqFt, amenities, availabilityDate,
        leaseTerms, rules, isVerified // isVerified might be admin-only
    }: Partial<IListing> = body;

    // Build update object carefully
    const updateData: Partial<IListing> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (location) updateData.location = location;
    if (images) updateData.images = images;
    if (roomType) updateData.roomType = roomType;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms;
    if (areaSqFt !== undefined) updateData.areaSqFt = areaSqFt;
    if (amenities) updateData.amenities = amenities;
    if (availabilityDate) updateData.availabilityDate = new Date(availabilityDate);
    if (leaseTerms) updateData.leaseTerms = leaseTerms;
    if (rules) updateData.rules = rules;
    // Admin should probably handle 'isVerified' changes separately.
    // For now, let's prevent users from verifying their own listings via this route.
    // if (isVerified !== undefined) updateData.isVerified = isVerified;


    const updatedListing = await ListingModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, context: 'query' }
    ).populate('createdBy', 'name email profilePicture');

    if (!updatedListing) {
        // This case should ideally be caught by the findById earlier, but as a safeguard:
        return NextResponse.json({ success: false, message: 'Listing not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedListing }, { status: 200 });

  } catch (error: any) {
    console.error(`Error updating listing ${params.id}:`, error);
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

// Delete a listing by ID
export async function DELETE(req: NextRequest, { params }: RequestContext) {
  try {
    const { id } = params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ success: false, message: 'Invalid listing ID format' }, { status: 400 });
    }

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

    const listingToDelete = await ListingModel.findById(id);
    if (!listingToDelete) {
      return NextResponse.json({ success: false, message: 'Listing not found' }, { status: 404 });
    }

    // Check if the authenticated user is the creator of the listing
    if (listingToDelete.createdBy.toString() !== authenticatedUserId) {
      // Add admin check here if admins can delete any listing
      return NextResponse.json(
        { success: false, message: 'Forbidden: You can only delete your own listings' },
        { status: 403 }
      );
    }

    await ListingModel.findByIdAndDelete(id);

    // Optionally, remove this listing from users' likedListings arrays (more complex, can be a background job)

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting listing ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
