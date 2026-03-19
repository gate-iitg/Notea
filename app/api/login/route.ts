import {prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//Login
export async function POST(req: Request){
    try {
        const body = await req.json();

        const { email, password } = body;

        if(!email || !password){
            return NextResponse.json(
                {message: "Email and password are required"},
                {status: 400},
            );
        }

        const user = await prisma.user.findUnique({
            where: {email},
        });

        if(!user){
            return NextResponse.json(
                {message: "User not found"},
                {status: 404},
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password as string
        );

        if(!isPasswordCorrect){
            return NextResponse.json(
                {message: "Invalid credentials"},
                {status: 401},
            );
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            "mysecretkey",
            {expiresIn: "1d"}
        );

        return NextResponse.json(
            {message: "Login Successful", token},
            {status: 200},
        );
    } catch(err){
        console.log("LOGIN ERROR:", err);
        return NextResponse.json(
            {message: "Something went wrong"},
            {status: 500},
        );
    }
}