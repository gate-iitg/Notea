"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NoteEditor from "../../components/NoteEditor";

type Note = {
  id: string;
  title: string;
  content?: string;
  pinned: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
};

// Each color: bg for the card, text color, accent for badges/footer, label
const COLOR_PALETTE = [
  { hex: "#fef3c7", label: "Amber",   text: "#78350f", accent: "#d97706", subtle: "#fde68a" },
  { hex: "#dcfce7", label: "Sage",    text: "#14532d", accent: "#16a34a", subtle: "#bbf7d0" },
  { hex: "#dbeafe", label: "Sky",     text: "#1e3a5f", accent: "#2563eb", subtle: "#bfdbfe" },
  { hex: "#fce7f3", label: "Rose",    text: "#831843", accent: "#db2777", subtle: "#fbcfe8" },
  { hex: "#ede9fe", label: "Violet",  text: "#3b0764", accent: "#7c3aed", subtle: "#ddd6fe" },
  { hex: "#ffedd5", label: "Peach",   text: "#7c2d12", accent: "#ea580c", subtle: "#fed7aa" },
];

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0].hex);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((d) => setNotes(d.notes || []));
  }, []);

  if (!isLoaded || !isSignedIn) return null;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "just now";
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const sortNotes = (list: Note[]) =>
    [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const resetForm = () => {
    setTitle(""); setContent(""); setColor(COLOR_PALETTE[0].hex);
    setEditingId(null); setOpen(false);
  };

  const createNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, color }),
    });
    const data = await res.json();
    setNotes((prev) => sortNotes([...prev, data.note]));
    resetForm();
  };

  const updateNote = async () => {
    const res = await fetch("/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId: editingId, title, content, color }),
    });
    const data = await res.json();
    setNotes((prev) => sortNotes(prev.map((n) => (n.id === editingId ? data.note : n))));
    resetForm();
  };

  const deleteNote = async (id: string) => {
    await fetch("/api/notes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId: id }),
    });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = async (note: Note) => {
    const res = await fetch("/api/notes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId: note.id, pinned: note.pinned }),
    });
    const data = await res.json();
    setNotes((prev) => sortNotes(prev.map((n) => (n.id === note.id ? data.note : n))));
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.pinned);
  const selectedPalette = COLOR_PALETTE.find((c) => c.hex === color) || COLOR_PALETTE[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0c0b0a; color: #e8e3dc; font-family: 'Geist', sans-serif; -webkit-font-smoothing: antialiased; }

        /* ── Navbar ── */
        .navbar {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem; height: 60px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(12,11,10,0.9); backdrop-filter: blur(14px);
        }
        .brand { display: flex; align-items: center; gap: 9px; }
        .brand-logo {
          width: 30px; height: 30px; border-radius: 8px; background: #c9a96e;
          display: flex; align-items: center; justify-content: center;
        }
        .brand-name { font-family: 'Instrument Serif', serif; font-size: 1.2rem; color: #f5f0e8; letter-spacing: 0.01em; }
        .navbar-right { display: flex; align-items: center; gap: 10px; }
        .search-wrap { position: relative; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); opacity: 0.3; pointer-events: none; }
        .search-input {
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          color: #e8e3dc; font-family: 'Geist', sans-serif; font-size: 13px;
          padding: 7px 14px 7px 32px; border-radius: 8px; width: 210px; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.22); }
        .search-input:focus { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.07); }

        .view-toggle { display: flex; border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; overflow: hidden; }
        .view-btn {
          width: 34px; height: 34px; background: transparent; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.3); transition: background 0.15s, color 0.15s;
        }
        .view-btn.active { background: rgba(255,255,255,0.08); color: #f5f0e8; }
        .view-btn:hover:not(.active) { color: rgba(255,255,255,0.6); }

        /* ── Main ── */
        .main { max-width: 1280px; margin: 0 auto; padding: 2.5rem 2.5rem 8rem; }
        .page-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 2.5rem; gap: 1rem; flex-wrap: wrap;
        }
        .page-title { font-family: 'Instrument Serif', serif; font-size: clamp(1.8rem, 3.5vw, 2.5rem); font-weight: 400; color: #f5f0e8; line-height: 1.15; }
        .page-title em { font-style: italic; color: #c9a96e; }
        .page-meta { font-size: 12px; color: rgba(255,255,255,0.28); font-weight: 300; margin-top: 4px; }
        .stats-row { display: flex; gap: 1rem; flex-wrap: wrap; }
        .stat-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 5px 12px; font-size: 12px; color: rgba(255,255,255,0.4);
        }
        .stat-dot { width: 6px; height: 6px; border-radius: 50%; }

        /* ── Section label ── */
        .section-label {
          font-size: 10px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.22); margin-bottom: 14px;
          display: flex; align-items: center; gap: 10px;
        }
        .section-label::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.06); }

        /* ── Grid ── */
        .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; margin-bottom: 2.5rem; }
        .notes-grid.list-view { grid-template-columns: 1fr; gap: 8px; }

        /* ── Note Card ── */
        .note-card {
          position: relative; border-radius: 14px; padding: 1.25rem 1.25rem 1rem;
          display: flex; flex-direction: column; gap: 10px; min-height: 164px;
          transition: transform 0.18s, box-shadow 0.18s; cursor: default;
          border: 1.5px solid transparent; overflow: hidden;
        }
        .note-card:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.22); }
        .list-view .note-card { min-height: unset; flex-direction: row; align-items: center; gap: 14px; border-radius: 10px; padding: 0.85rem 1.1rem; }
        .list-view .note-card:hover { transform: translateX(4px); box-shadow: none; }

        .note-pin-badge { font-size: 10px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 2px; display: flex; align-items: center; gap: 4px; opacity: 0.7; }
        .note-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
        .list-view .note-card-top { flex: 1; }
        .note-title { font-family: 'Instrument Serif', serif; font-size: 1.05rem; font-weight: 400; line-height: 1.3; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .list-view .note-title { -webkit-line-clamp: 1; font-size: 0.95rem; }

        .note-actions { display: flex; gap: 2px; opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
        .note-card:hover .note-actions { opacity: 1; }
        .note-action-btn {
          width: 28px; height: 28px; border-radius: 6px; border: none;
          background: rgba(0,0,0,0.07); cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: background 0.15s;
        }
        .note-action-btn:hover { background: rgba(0,0,0,0.16); }
        .note-action-btn.danger:hover { background: rgba(200,30,30,0.12); }

        .note-body { font-size: 13px; line-height: 1.65; font-weight: 400; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; flex: 1; opacity: 0.72; }
        .list-view .note-body { -webkit-line-clamp: 1; }
        .note-footer { display: flex; align-items: center; justify-content: space-between; font-size: 11px; font-weight: 400; opacity: 0.5; margin-top: auto; letter-spacing: 0.02em; }
        .word-count { font-size: 10px; opacity: 0.35; letter-spacing: 0.04em; }

        /* ── Empty state ── */
        .empty-state { padding: 5rem 2rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .empty-icon { width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; opacity: 0.5; }
        .empty-state p { font-size: 14px; color: rgba(255,255,255,0.25); font-weight: 300; }

        /* ── FAB ── */
        .fab {
          position: fixed; bottom: 2rem; right: 2rem;
          display: flex; align-items: center; gap: 8px; padding: 0 22px; height: 50px;
          background: #c9a96e; color: #1a1208; border: none; border-radius: 25px;
          font-family: 'Geist', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer;
          box-shadow: 0 4px 20px rgba(201,169,110,0.3);
          transition: transform 0.2s, box-shadow 0.2s; z-index: 40; letter-spacing: 0.01em;
        }
        .fab:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,169,110,0.4); }
        .fab:active { transform: scale(0.97); }
        .fab-icon { font-size: 20px; font-weight: 300; line-height: 1; }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 100;
          animation: bdfadeIn 0.15s ease;
        }
        @keyframes bdfadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .modal {
          background: #161412; border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px; width: 580px; max-width: calc(100vw - 2rem);
          overflow: hidden; animation: modalUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
        }
        .modal-top-bar {
          display: flex; align-items: center; gap: 8px;
          padding: 1rem 1.25rem 0.85rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .modal-title-input {
          background: transparent; border: none; outline: none;
          font-family: 'Instrument Serif', serif; font-size: 1.35rem; color: #f5f0e8; width: 100%;
          caret-color: #c9a96e;
        }
        .modal-title-input::placeholder { color: rgba(255,255,255,0.18); }

        /* Color picker */
        .color-picker-row {
          display: flex; align-items: center; gap: 10px;
          padding: 0.65rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
        }
        .color-picker-label { font-size: 11px; color: rgba(255,255,255,0.28); letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500; flex-shrink: 0; }
        .color-swatch-btn {
          width: 20px; height: 20px; border-radius: 50%; cursor: pointer;
          border: 2px solid transparent; transition: transform 0.15s, border-color 0.15s; flex-shrink: 0;
        }
        .color-swatch-btn:hover { transform: scale(1.2); }
        .color-swatch-btn.selected { border-color: rgba(255,255,255,0.8); transform: scale(1.18); }
        .color-preview-name { font-size: 11px; color: rgba(255,255,255,0.3); font-weight: 300; margin-left: 4px; }

        /*
          ─── DARK MODAL EDITOR OVERRIDE ───
          Forces TipTap / any rich-text editor inside the modal to use dark colors.
        */
        .modal-editor-wrap {
          padding: 0;
          min-height: 220px;
          background: #161412;
        }

        /* Kill any white backgrounds on editor containers */
        .modal-editor-wrap > *,
        .modal-editor-wrap > * > *,
        .modal-editor-wrap [class*="editor"],
        .modal-editor-wrap [class*="Editor"],
        .modal-editor-wrap [class*="wrapper"],
        .modal-editor-wrap [class*="Wrapper"],
        .modal-editor-wrap [class*="container"],
        .modal-editor-wrap [class*="Container"] {
          background: transparent !important;
          background-color: transparent !important;
          color: rgba(255,255,255,0.78) !important;
          border-color: rgba(255,255,255,0.08) !important;
        }

        /* Toolbar strip */
        .modal-editor-wrap [class*="toolbar"],
        .modal-editor-wrap [class*="Toolbar"],
        .modal-editor-wrap [class*="menu"],
        .modal-editor-wrap [class*="Menu"],
        .modal-editor-wrap [role="toolbar"] {
          background: rgba(255,255,255,0.03) !important;
          background-color: rgba(255,255,255,0.03) !important;
          border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          padding: 6px 1.25rem !important;
        }

        /* All toolbar buttons */
        .modal-editor-wrap button {
          background: transparent !important;
          background-color: transparent !important;
          color: rgba(255,255,255,0.5) !important;
          border: none !important;
          border-radius: 5px !important;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
        }
        .modal-editor-wrap button:hover {
          background: rgba(255,255,255,0.09) !important;
          color: #f5f0e8 !important;
        }
        .modal-editor-wrap button.is-active,
        .modal-editor-wrap button[data-active="true"],
        .modal-editor-wrap button[class*="active"] {
          background: rgba(201,169,110,0.18) !important;
          color: #c9a96e !important;
        }

        /* SVG icons inside toolbar */
        .modal-editor-wrap button svg { stroke: currentColor; fill: none; }

        /* Prose editable area */
        .modal-editor-wrap .ProseMirror,
        .modal-editor-wrap [contenteditable="true"] {
          outline: none !important;
          min-height: 160px;
          padding: 1rem 1.25rem !important;
          font-size: 14px !important;
          font-family: 'Geist', sans-serif !important;
          font-weight: 300 !important;
          line-height: 1.75 !important;
          color: rgba(255,255,255,0.78) !important;
          background: transparent !important;
          caret-color: #c9a96e !important;
        }

        /* Placeholder */
        .modal-editor-wrap .ProseMirror p.is-editor-empty:first-child::before,
        .modal-editor-wrap [contenteditable] p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.2);
          float: left; pointer-events: none; height: 0;
        }

        /* Dividers / separators in toolbar */
        .modal-editor-wrap [class*="divider"],
        .modal-editor-wrap [class*="separator"] {
          background: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.1) !important;
        }

        /* Select / dropdown inside toolbar */
        .modal-editor-wrap select {
          background: rgba(255,255,255,0.07) !important;
          color: rgba(255,255,255,0.6) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 5px !important;
          outline: none;
        }

        /* ── Modal footer ── */
        .modal-footer {
          padding: 0.9rem 1.25rem; display: flex; justify-content: space-between; align-items: center;
          border-top: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02);
        }
        .modal-footer-left { font-size: 12px; color: rgba(255,255,255,0.2); font-weight: 300; }
        .btn-cancel {
          padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
          background: transparent; color: rgba(255,255,255,0.4);
          font-family: 'Geist', sans-serif; font-size: 13px; cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); }
        .btn-save {
          padding: 8px 22px; border-radius: 8px; border: none;
          background: #c9a96e; color: #1a1208;
          font-family: 'Geist', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s, transform 0.1s; margin-left: 8px;
        }
        .btn-save:hover { background: #d4b87a; }
        .btn-save:active { transform: scale(0.97); }

        @media (max-width: 640px) {
          .navbar { padding: 0 1.25rem; }
          .main { padding: 1.5rem 1.25rem 7rem; }
          .notes-grid { grid-template-columns: 1fr; }
          .stats-row { display: none; }
          .search-input { width: 150px; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0c0b0a" }}>

        {/* ── Navbar ── */}
        <nav className="navbar">
          <div className="brand">
            <div className="brand-logo">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="2.5" width="10" height="1.4" rx="0.7" fill="#1a1208" />
                <rect x="2" y="5.8" width="7" height="1.4" rx="0.7" fill="#1a1208" opacity="0.7" />
                <rect x="2" y="9.1" width="8.5" height="1.4" rx="0.7" fill="#1a1208" opacity="0.7" />
              </svg>
            </div>
            <span className="brand-name">Notea</span>
          </div>

          <div className="navbar-right">
            <div className="search-wrap">
              <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.2" />
                <path d="M9.5 9.5L12 12" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <input className="search-input" placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="view-toggle">
              <button className={`view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} title="Grid view">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="currentColor" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="currentColor" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="currentColor" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="currentColor" />
                </svg>
              </button>
              <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} title="List view">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="2" width="12" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="1" y="6.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
                  <rect x="1" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor" />
                </svg>
              </button>
            </div>

            <UserButton />
          </div>
        </nav>

        {/* ── Main ── */}
        <main className="main">
          <div className="page-header">
            <div>
              <h1 className="page-title">Your <em>notes</em></h1>
              <p className="page-meta">
                {notes.length} {notes.length === 1 ? "note" : "notes"}
                {search && ` · ${filteredNotes.length} matching "${search}"`}
              </p>
            </div>
            <div className="stats-row">
              <div className="stat-pill"><span className="stat-dot" style={{ background: "#c9a96e" }} />{pinnedNotes.length} pinned</div>
              <div className="stat-pill"><span className="stat-dot" style={{ background: "rgba(255,255,255,0.3)" }} />{unpinnedNotes.length} notes</div>
            </div>
          </div>

          {pinnedNotes.length > 0 && (
            <div style={{ marginBottom: "2.5rem" }}>
              <div className="section-label">Pinned</div>
              <div className={`notes-grid${view === "list" ? " list-view" : ""}`}>
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} view={view} formatTime={formatTime}
                    onEdit={() => { setEditingId(note.id); setTitle(note.title); setContent(note.content || ""); setColor(note.color || COLOR_PALETTE[0].hex); setOpen(true); }}
                    onDelete={() => deleteNote(note.id)} onTogglePin={() => togglePin(note)} />
                ))}
              </div>
            </div>
          )}

          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && <div className="section-label">All notes</div>}
              <div className={`notes-grid${view === "list" ? " list-view" : ""}`}>
                {unpinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} view={view} formatTime={formatTime}
                    onEdit={() => { setEditingId(note.id); setTitle(note.title); setContent(note.content || ""); setColor(note.color || COLOR_PALETTE[0].hex); setOpen(true); }}
                    onDelete={() => deleteNote(note.id)} onTogglePin={() => togglePin(note)} />
                ))}
              </div>
            </div>
          )}

          {filteredNotes.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeLinecap="round">
                  <rect x="4" y="3" width="14" height="16" rx="2" /><path d="M8 8h6M8 12h4" />
                </svg>
              </div>
              <p>{search ? `No notes match "${search}"` : "No notes yet — create your first one."}</p>
            </div>
          )}
        </main>

        {/* ── FAB ── */}
        <button className="fab" onClick={() => setOpen(true)}>
          <span className="fab-icon">+</span>New note
        </button>

        {/* ── Modal ── */}
        {open && (
          <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && resetForm()}>
            <div className="modal">

              <div className="modal-top-bar">
                <input className="modal-title-input" placeholder="Note title..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
              </div>

              <div className="color-picker-row">
                <span className="color-picker-label">Color</span>
                {COLOR_PALETTE.map((c) => (
                  <button key={c.hex} title={c.label}
                    className={`color-swatch-btn ${color === c.hex ? "selected" : ""}`}
                    style={{ background: c.hex }}
                    onClick={() => setColor(c.hex)}
                  />
                ))}
                <span className="color-preview-name">{selectedPalette.label}</span>
              </div>

              {/* Dark editor wrapper — overrides any white bg the NoteEditor applies */}
              <div className="modal-editor-wrap">
                <NoteEditor content={content} setContent={setContent} />
              </div>

              <div className="modal-footer">
                <span className="modal-footer-left">{editingId ? "Editing note" : "New note"}</span>
                <div style={{ display: "flex" }}>
                  <button className="btn-cancel" onClick={resetForm}>Cancel</button>
                  <button className="btn-save" onClick={editingId ? updateNote : createNote}>
                    {editingId ? "Update" : "Save note"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ── NoteCard component ── */
function NoteCard({ note, view, formatTime, onEdit, onDelete, onTogglePin }: {
  note: Note; view: "grid" | "list";
  formatTime: (d?: string) => string;
  onEdit: () => void; onDelete: () => void; onTogglePin: () => void;
}) {
  const palette = COLOR_PALETTE.find((c) => c.hex === note.color) || COLOR_PALETTE[0];
  const wordCount = note.content
    ? note.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="note-card" style={{ background: palette.hex, borderColor: palette.subtle, color: palette.text }}>
      <div className="note-card-top">
        <div style={{ flex: 1, overflow: "hidden" }}>
          {note.pinned && (
            <div className="note-pin-badge" style={{ color: palette.accent }}>
              <svg width="9" height="9" viewBox="0 0 9 9" fill={palette.accent}>
                <path d="M4.5 0.5L5.5 3.5H8.5L6 5.5L7 8.5L4.5 6.5L2 8.5L3 5.5L0.5 3.5H3.5L4.5 0.5Z" />
              </svg>
              Pinned
            </div>
          )}
          <div className="note-title" style={{ color: palette.text }}>{note.title || "Untitled"}</div>
        </div>

        <div className="note-actions">
          <button className="note-action-btn pin" title={note.pinned ? "Unpin" : "Pin"} onClick={onTogglePin} style={{ color: palette.accent }}>
            {note.pinned
              ? <svg width="12" height="12" viewBox="0 0 12 12" fill={palette.accent}><path d="M6 0.5L7.5 4H11.5L8.5 6.5L9.5 11L6 8.5L2.5 11L3.5 6.5L0.5 4H4.5L6 0.5Z" /></svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={palette.accent} strokeWidth="1.2"><path d="M6 0.5L7.5 4H11.5L8.5 6.5L9.5 11L6 8.5L2.5 11L3.5 6.5L0.5 4H4.5L6 0.5Z" /></svg>
            }
          </button>
          <button className="note-action-btn" title="Edit" onClick={onEdit} style={{ color: palette.text }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" />
            </svg>
          </button>
          <button className="note-action-btn danger" title="Delete" onClick={onDelete} style={{ color: palette.text }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
              <path d="M2 3.5H10M4.5 3.5V2.5H7.5V3.5M3.5 3.5L4 9.5H8L8.5 3.5" />
            </svg>
          </button>
        </div>
      </div>

      {view === "grid" && (
        <div className="note-body" style={{ color: palette.text }}
          dangerouslySetInnerHTML={{ __html: note.content || "<p style='opacity:0.3'>No content</p>" }}
        />
      )}

      <div className="note-footer" style={{ color: palette.text }}>
        <span>{formatTime(note.updatedAt)}</span>
        {view === "grid" && wordCount > 0 && <span className="word-count">{wordCount}w</span>}
      </div>
    </div>
  );
}