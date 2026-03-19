import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema
const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  color: z.string().optional(),
});

// ================= CREATE =================
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = noteSchema.parse(body);

    const note = await prisma.note.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        userId,
        color: validatedData.color,
      },
    });

    return NextResponse.json({ note });
  } catch (err) {
    console.log("Create Note error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// ================= GET =================
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: [
        { pinned: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return NextResponse.json({ notes });
  } catch (err) {
    console.log("Fetch Notes error:", err);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// ================= UPDATE =================
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { noteId, title, content, color } = body;

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        title,
        content,
        color,
      },
    });

    return NextResponse.json({ note });
  } catch (err) {
    console.log("Edit note error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { noteId } = body;

    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("Delete note error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// ================= PIN =================
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { noteId, pinned } = body;

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        pinned: !pinned,
      },
    });

    return NextResponse.json({ note });
  } catch (err) {
    console.log("Pin note error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}