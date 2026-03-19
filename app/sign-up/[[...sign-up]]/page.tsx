"use client";

import { SignUp } from "@clerk/nextjs";

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
    card: {
      background: "transparent", boxShadow: "none", border: "none",
      padding: "0", margin: "0", width: "100%", gap: "16px",
    },
    headerTitle: { display: "none" },
    headerSubtitle: { display: "none" },
    header: { display: "none" },
    socialButtonsBlockButton: {
      background: "#ffffff", border: "1px solid #ddd8d0", color: "#1c1917",
      borderRadius: "10px", fontSize: "13px", fontWeight: "400",
      boxShadow: "0 1px 3px rgba(0,0,0,0.07)", height: "42px",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "10px", width: "100%", padding: "0 16px",
    },
    socialButtonsBlockButtonText: { color: "#1c1917", fontWeight: "400", fontSize: "13px" },
    socialButtonsProviderIcon: { width: "16px", height: "16px" },
    socialButtons: { width: "100%", gap: "8px" },
    socialButtonsBlockButtons: { width: "100%", gap: "8px", flexDirection: "column" as const },
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
      fontSize: "14px", fontWeight: "500", border: "none", height: "44px",
      boxShadow: "0 2px 10px rgba(201,169,110,0.3)", width: "100%",
    },
    footerActionLink: { color: "#c9a96e", fontWeight: "500" },
    footerActionText: { color: "#a8a29e", fontSize: "13px" },
    footer: { background: "transparent", border: "none" },
    main: { gap: "14px", width: "100%" },
    form: { gap: "14px", width: "100%" },
    identityPreviewText: { color: "#1c1917" },
    identityPreviewEditButton: { color: "#c9a96e" },
    formResendCodeLink: { color: "#c9a96e" },
    otpCodeFieldInput: {
      background: "#edeae4", border: "1px solid #ddd8d0",
      color: "#1c1917", borderRadius: "8px",
    },
    alertText: { color: "#dc2626", fontSize: "13px" },
    formFieldErrorText: { color: "#dc2626", fontSize: "12px" },
  },
};

const features = [
  { icon: "✦", text: "Free to get started, always" },
  { icon: "✦", text: "Rich text editor built in" },
  { icon: "✦", text: "Color-coded notes at a glance" },
  { icon: "✦", text: "Grid and list view switching" },
];

export default function SignUpPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ed !important; font-family: 'Geist', sans-serif; -webkit-font-smoothing: antialiased; }

        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #f5f2ed;
        }

        .auth-left {
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 3rem 3.5rem;
          background: #ede9e2;
          border-right: 1px solid #ddd8d0;
          position: relative; overflow: hidden;
        }
        .auth-left::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(circle, #c4bdb5 1px, transparent 1px);
          background-size: 28px 28px; opacity: 0.35; pointer-events: none;
        }
        .auth-left::after {
          content: ''; position: absolute;
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
        .auth-feature-icon { font-size: 8px; color: #c9a96e; flex-shrink: 0; opacity: 0.8; }
        .auth-left-footer { font-size: 12px; color: #b5afa8; font-weight: 300; }

        .auth-right {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 3rem 4rem; background: #f5f2ed;
        }
        .auth-form-wrap { width: 100%; max-width: 360px; }
        .auth-form-header { margin-bottom: 2rem; }
        .auth-form-title { font-family: 'Instrument Serif', serif; font-size: 1.9rem; font-weight: 400; color: #1c1917; line-height: 1.15; margin-bottom: 5px; }
        .auth-form-title em { font-style: italic; color: #c9a96e; }
        .auth-form-sub { font-size: 13px; color: #a8a29e; font-weight: 300; }

        .auth-clerk-wrap { width: 100%; }

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

        .auth-clerk-wrap .cl-socialButtonsBlockButton,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"] {
          background: #ffffff !important;
          background-color: #ffffff !important;
          border: 1px solid #ddd8d0 !important;
          color: #1c1917 !important;
          border-radius: 10px !important;
          height: 42px !important;
          width: 100% !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 10px !important;
          font-size: 13px !important;
          transition: background 0.15s, border-color 0.15s !important;
          margin-bottom: 8px !important;
        }
        .auth-clerk-wrap .cl-socialButtonsBlockButton:last-child,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"]:last-child { margin-bottom: 0 !important; }
        .auth-clerk-wrap .cl-socialButtonsBlockButton:hover,
        .auth-clerk-wrap [class*="socialButtonsBlockButton"]:hover {
          background: #f5f2ee !important;
          background-color: #f5f2ee !important;
          border-color: #ccc7c0 !important;
        }
        .auth-clerk-wrap .cl-socialButtonsBlockButtonText,
        .auth-clerk-wrap [class*="socialButtonsBlockButtonText"] { color: #1c1917 !important; font-size: 13px !important; }

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

        .auth-clerk-wrap .cl-footer,
        .auth-clerk-wrap [class*="footer"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        @media (max-width: 768px) {
          .auth-page { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 2.5rem 1.5rem; }
        }
      `}</style>

      <div className="auth-page">
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

            <h1 className="auth-tagline">
              Start writing,<br /><em>start thinking</em><br />more clearly.
            </h1>
            <p className="auth-desc">
              Join Notea and give your ideas a home. Rich notes, instant search, and a clean space to think.
            </p>

            <div className="auth-features">
              {features.map((f) => (
                <div className="auth-feature" key={f.text}>
                  <span className="auth-feature-icon">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          <div className="auth-left-bottom">
            <p className="auth-left-footer">© {new Date().getFullYear()} Notea. All rights reserved.</p>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h2 className="auth-form-title">Create an <em>account</em></h2>
              <p className="auth-form-sub">Get started — it only takes a moment</p>
            </div>

            <div className="auth-clerk-wrap">
              <SignUp appearance={clerkAppearance} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}