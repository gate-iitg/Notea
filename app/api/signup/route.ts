import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";

//Signup
export async function POST(req: Request){
    try {
        const body = await req.json();

        const { email, password, name } = body;
        
        if(!email || !password){
            return NextResponse.json(
                {message: "Email and password are required"},
                {status: 400}
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {message: "User created", user},
            {status: 201},
        );
    } catch (error){
        console.error("SIGNUP ERROR:", error);
        return NextResponse.json(
            {message: "Somethign went wrong"},
            {status: 500},
        );
    }
}