
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export async function PUT(request, { params }) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();

        const formData = await request.formData();
        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        // Check if the seller owns this product
        if (product.userId !== userId) {
            return NextResponse.json({ success: false, message: 'Not authorized to edit this product' });
        }

        const updateData = {
            name: formData.get('name'),
            description: formData.get('description'),
            price: Number(formData.get('price')),
            offerPrice: Number(formData.get('offerPrice')),
            category: formData.get('category'),
        };

        // Handle images if provided
        const images = formData.getAll('images');
        if (images && images.length > 0 && images[0].size > 0) {
            // For now, keep existing images - you can implement image upload logic here
            // updateData.image = images;
        }

        // Generate new slug if name changed
        if (updateData.name !== product.name) {
            updateData.slug = updateData.name
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json({ 
            success: true, 
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
