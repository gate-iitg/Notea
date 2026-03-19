"use client";

import { SignIn } from "@clerk/nextjs";

const clerkAppearance = {
  layout: {
    logoPlacement: "none" as const,
    showOptionalFields: false,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#c9a96e",
    colorBackground: "transparent",
    colorInputBackground: "#edeae4",
    colorInputText: "#1c1917",
    colorText: "#1c1917",
    colorTextSecondary: "#78716c",
    colorNeutral: "#44403c",
    colorDanger: "#dc2626",
    colorSuccess: "#16a34a",
    fontFamily: "'Geist', sans-serif",
    fontSize: "14px",
    borderRadius: "10px",
  },
  elements: {
    rootBox: { width: "100%", boxShadow: "none", background: "transparent" },
    card: { background: "transparent", boxShadow: "none", border: "none", padding: "0", margin: "0", width: "100%" },
    header: { display: "none" },
    headerTitle: { display: "none" },
    headerSubtitle: { display: "none" },
    badge: { display: "none", opacity: 0, visibility: "hidden" as const, width: "0", height: "0" },
    socialButtonsBlockButtons: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      width: "100%",
    },
    socialButtonsBlockButton: {
      background: "#ffffff",
      border: "1px solid #ddd8d0",
      color: "#1c1917",
      borderRadius: "10px",
      fontSize: "13px",
      fontWeight: "400",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      height: "42px",
      minHeight: "42px",
      maxHeight: "42px",
      width: "100%",
      minWidth: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "0 16px",
      flex: "none",
      position: "relative" as const,
      overflow: "hidden",
    },
    socialButtonsBlockButtonText: { color: "#1c1917", fontWeight: "400", fontSize: "13px" },
    socialButtonsProviderIcon: { width: "18px", height: "18px", position: "relative", display: "block", flexShrink: "0", overflow: "visible" },
    dividerLine: { background: "#ddd8d0" },
    dividerText: { color: "#b5afa8", fontSize: "12px" },
    formFieldLabel: {
      color: "#6b6560", fontSize: "11.5px", fontWeight: "500",
      letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: "5px",
    },
    formFieldInput: {
      background: "#edeae4", border: "1px solid #ddd8d0", color: "#1c1917",
      borderRadius: "10px", fontSize: "14px", height: "42px",
      padding: "0 14px", boxShadow: "none", width: "100%",
    },
    formFieldInputShowPasswordButton: { color: "#a8a29e" },
    formButtonPrimary: {
      background: "#c9a96e", color: "#1a1208", borderRadius: "10px",
      fontSize: "14px", fontWeight: "500", border: "none",
      height: "44px", boxShadow: "0 2px 10px rgba(201,169,110,0.3)", width: "100%",
    },
    footerActionLink: { color: "#c9a96e", fontWeight: "500" },
    footerActionText: { color: "#a8a29e", fontSize: "13px" },
    footer: { background: "transparent", border: "none" },
    main: { gap: "14px", width: "100%" },
    form: { gap: "14px", width: "100%" },
    identityPreviewText: { color: "#1c1917" },
    identityPreviewEditButton: { color: "#c9a96e" },
    formResendCodeLink: { color: "#c9a96e" },
    alertText: { color: "#dc2626", fontSize: "13px" },
    formFieldErrorText: { color: "#dc2626", fontSize: "12px" },
  },
};

const features = [
  { text: "Rich text notes with formatting" },
  { text: "Pin your most important notes" },
  { text: "Search across everything instantly" },
  { text: "Six beautiful note colors" },
];

export default function SignInPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          overflow: hidden;
          background: #f5f2ed !important;
          font-family: 'Geist', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .auth-page {
          height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        /* ── Left panel ── */
        .auth-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem 3.5rem;
          background: #ede9e2;
          border-right: 1px solid #ddd8d0;
          position: relative;
          overflow: hidden;
        }
        .auth-left::before {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, #c4bdb5 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.35;
          pointer-events: none;
        }
        .auth-left::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent, #c9a96e40, transparent);
          pointer-events: none;
        }
        .auth-left-top { position: relative; z-index: 2; }
        .auth-left-bottom { position: relative; z-index: 2; }

        .auth-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 4rem; }
        .auth-brand-logo {
          width: 34px; height: 34px; border-radius: 9px; background: #c9a96e;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(201,169,110,0.3);
        }
        .auth-brand-name { font-family: 'Instrument Serif', serif; font-size: 1.25rem; color: #1c1917; }

        .auth-tagline { font-family: 'Instrument Serif', serif; font-size: clamp(1.75rem, 2.5vw, 2.4rem); font-weight: 400; color: #1c1917; line-height: 1.2; margin-bottom: 1rem; }
        .auth-tagline em { font-style: italic; color: #c9a96e; }
        .auth-desc { font-size: 13.5px; color: #78716c; font-weight: 300; line-height: 1.75; margin-bottom: 2.5rem; }

        .auth-features { display: flex; flex-direction: column; gap: 13px; }
        .auth-feature { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #92877e; font-weight: 300; }
        .auth-feature-dot { width: 5px; height: 5px; border-radius: 50%; background: #c9a96e; opacity: 0.7; flex-shrink: 0; }
        .auth-left-footer { font-size: 12px; color: #b5afa8; font-weight: 300; }

        /* ── Right panel ── */
        .auth-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 4rem;
          background: #f5f2ed;
          overflow-y: auto;
        }
        .auth-form-wrap { width: 100%; max-width: 360px; }
        .auth-form-header { margin-bottom: 2rem; }
        .auth-form-title { font-family: 'Instrument Serif', serif; font-size: 1.9rem; font-weight: 400; color: #1c1917; line-height: 1.15; margin-bottom: 5px; }
        .auth-form-title em { font-style: italic; color: #c9a96e; }
        .auth-form-sub { font-size: 13px; color: #a8a29e; font-weight: 300; }

        /* ── Clerk overrides ── */
        .auth-clerk-wrap { width: 100%; }

        /* Kill card box at every level */
        .auth-clerk-wrap > div,
        .auth-clerk-wrap .cl-rootBox,
        .auth-clerk-wrap .cl-card,
        .auth-clerk-wrap [class*="rootBox"],
        .auth-clerk-wrap [class*="card"] {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        /* Force the buttons container to column */
        .auth-clerk-wrap [class*="socialButtonsBlockButtons"],
        .auth-clerk-wrap [class*="socialButtonsIconButtons"],
        .auth-clerk-wrap .cl-socialButtonsBlockButtons {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          width: 100% !important;
        }

        /* The featured first-button wrapper Clerk adds — flatten it */
        .auth-clerk-wrap [class*="socialButtonsBlockButtons"] > div,
        .auth-clerk-wrap [class*="socialButtonsBlockButtons"] > span {
          display: contents !important;
          border: none !important;
          outline: none !important;
        }

        /* Every social button: block, icon, first, last — all identical */
        .auth-clerk-wrap [class*="socialButtons"] button,
        .auth-clerk-wrap .cl-socialButtonsBlockButton,
        .auth-clerk-wrap .cl-socialButtonsIconButton,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"],
        .auth-clerk-wrap [class*="socialButtonsIconButton"] {
          background: #ffffff !important;
          background-color: #ffffff !important;
          border: 1px solid #ddd8d0 !important;
          color: #1c1917 !important;
          border-radius: 10px !important;
          height: 42px !important;
          min-height: 42px !important;
          max-height: 42px !important;
          width: 100% !important;
          min-width: 0 !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          font-size: 13px !important;
          padding: 0 16px !important;
          flex: none !important;
          transition: background 0.15s, border-color 0.15s !important;
          margin: 0 !important;
          position: relative !important;
          overflow: visible !important;
          clip-path: none !important;
          -webkit-clip-path: none !important;
        }
        .auth-clerk-wrap [class*="socialButtons"] button:hover,
        .auth-clerk-wrap .cl-socialButtonsBlockButton:hover,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"]:hover {
          background: #f5f2ee !important;
          background-color: #f5f2ee !important;
          border-color: #ccc7c0 !important;
        }

        /* Button text */
        .auth-clerk-wrap [class*="socialButtonsBlockButtonText"],
        .auth-clerk-wrap [class*="socialButtonsIconButtonText"],
        .auth-clerk-wrap .cl-socialButtonsBlockButtonText {
          color: #1c1917 !important;
          font-size: 13px !important;
        }

        /* Provider icon — ensure it's always visible and not clipped */
        .auth-clerk-wrap [class*="socialButtonsBlockButton"] img,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"] svg,
        .auth-clerk-wrap [class*="socialButtonsProviderIcon"],
        .auth-clerk-wrap [class*="providerIcon"],
        .auth-clerk-wrap .cl-socialButtonsProviderIcon,
        .auth-clerk-wrap [class*="socialButtons"] button img,
        .auth-clerk-wrap [class*="socialButtons"] button svg {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          overflow: visible !important;
          clip-path: none !important;
          -webkit-clip-path: none !important;
          position: relative !important;
          z-index: 2 !important;
          flex-shrink: 0 !important;
          width: 18px !important;
          height: 18px !important;
        }

        /* The icon wrapper box that Clerk puts around the logo */
        .auth-clerk-wrap [class*="socialButtonsBlockButton"] > span:first-child,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"] > div:first-child {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 20px !important;
          height: 20px !important;
          flex-shrink: 0 !important;
          overflow: visible !important;
          position: relative !important;
        }

        /* Badge — nuke completely */
        .auth-clerk-wrap [class*="badge"],
        .auth-clerk-wrap [class*="Badge"],
        .auth-clerk-wrap .cl-badge {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          overflow: visible !important;
          clip-path: none !important;
          -webkit-clip-path: none !important;
          visibility: hidden !important;
          position: absolute !important;
          pointer-events: none !important;
        }

        /* Inputs */
        .auth-clerk-wrap input[type="email"],
        .auth-clerk-wrap input[type="password"],
        .auth-clerk-wrap input[type="text"] {
          background: #edeae4 !important;
          background-color: #edeae4 !important;
          border: 1px solid #ddd8d0 !important;
          color: #1c1917 !important;
          border-radius: 10px !important;
          height: 42px !important;
          font-size: 14px !important;
          width: 100% !important;
          padding: 0 14px !important;
        }
        .auth-clerk-wrap input:focus {
          border-color: rgba(201,169,110,0.7) !important;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12) !important;
          outline: none !important;
        }
        .auth-clerk-wrap input::placeholder { color: #b5afa8 !important; }

        /* Footer area */
        .auth-clerk-wrap .cl-footer,
        .auth-clerk-wrap [class*="footer"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        @media (max-width: 768px) {
          html, body { overflow: auto; }
          .auth-page { height: auto; min-height: 100vh; grid-template-columns: 1fr; overflow: visible; }
          .auth-left { display: none; }
          .auth-right { padding: 2.5rem 1.5rem; overflow: visible; }
        }
      `}</style>

      <div className="auth-page">

        {/* ── Left branding panel ── */}
        <div className="auth-left">
          <div className="auth-left-top">
            <div className="auth-brand">
              <div className="auth-brand-logo">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="1.6" rx="0.8" fill="#1a1208" />
                  <rect x="2" y="7" width="8.5" height="1.6" rx="0.8" fill="#1a1208" opacity="0.7" />
                  <rect x="2" y="11" width="10" height="1.6" rx="0.8" fill="#1a1208" opacity="0.7" />
                </svg>
              </div>
              <span className="auth-brand-name">Notea</span>
            </div>
            <h1 className="auth-tagline">Your thoughts,<br /><em>beautifully</em><br />organised.</h1>
            <p className="auth-desc">A quiet space for your ideas. Write freely, organise effortlessly, and find anything in seconds.</p>
            <div className="auth-features">
              {features.map((f) => (
                <div className="auth-feature" key={f.text}>
                  <span className="auth-feature-dot" />
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="auth-left-bottom">
            <p className="auth-left-footer">© {new Date().getFullYear()} Notea. All rights reserved.</p>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Welcome <em>back</em></h2>
              <p className="auth-form-sub">Sign in to continue to your notes</p>
            </div>
            <div className="auth-clerk-wrap">
              <SignIn appearance={clerkAppearance} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}