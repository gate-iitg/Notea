"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
} from "lucide-react";

type Props = {
  content: string;
  setContent: (val: string) => void;
};

export default function NoteEditor({ content, setContent }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-6",
          },
        },
      }),
      Underline,
    ],
    content,
    immediatelyRender: false,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  const baseBtn =
    "p-2 rounded transition flex items-center justify-center";

  const activeBtn = "bg-gray-300";
  const hoverBtn = "hover:bg-gray-200";

  return (
    <div className="border rounded-lg p-3 bg-white">

      {/* Toolbar */}
      <div className="flex gap-2 mb-3 border-b pb-2">

        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${baseBtn} ${hoverBtn} ${
            editor.isActive("bold") ? activeBtn : ""
          }`}
        >
          <Bold size={18} />
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${baseBtn} ${hoverBtn} ${
            editor.isActive("italic") ? activeBtn : ""
          }`}
        >
          <Italic size={18} />
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${baseBtn} ${hoverBtn} ${
            editor.isActive("underline") ? activeBtn : ""
          }`}
        >
          <UnderlineIcon size={18} />
        </button>

        {/* Strike */}
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${baseBtn} ${hoverBtn} ${
            editor.isActive("strike") ? activeBtn : ""
          }`}
        >
          <Strikethrough size={18} />
        </button>

        {/* Bullet List */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${baseBtn} ${hoverBtn} ${
            editor.isActive("bulletList") ? activeBtn : ""
          }`}
        >
          <List size={18} />
        </button>

      </div>

      {/* Editor Area */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] outline-none"
      />

    </div>
  );
}