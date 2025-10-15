import { auth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    const { email } = await request.json();

    try {
        const user = await auth.getUserByEmail(email);
        await auth.deleteUser(user.uid);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete user account" },
            { status: 500 }
        );
    }
}
