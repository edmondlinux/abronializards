
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";

export async function DELETE(request, { params }) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();

        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        // Check if the seller owns this product
        if (product.userId !== userId) {
            return NextResponse.json({ success: false, message: 'Not authorized to delete this product' });
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ 
            success: true, 
            message: 'Product deleted successfully'
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
