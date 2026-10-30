import { useEffect, useRef, useState } from "react";

const A = "/assets";

type SpeechRecognitionEventLike = Event & {
  results: {
    length: number;
    [key: number]: { [key: number]: { transcript: string } };
  };
};

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type RecognitionConstructor = new () => Recognition;

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

const topics = [
  { icon: "c98f2.svg", title: "Explore space", detail: "Moons & stars", tone: "lilac" },
  { icon: "e148e.svg", title: "Animal wonders", detail: "Paws & roars", tone: "mint" },
  { icon: "8006a.svg", title: "Number fun", detail: "Count & play", tone: "peach" },
  { icon: "044fd.svg", title: "Story time", detail: "Imagine a world", tone: "blue" },
];

type BackgroundChoice = "blue" | "green" | "pink";
type FontSizeChoice = "small" | "medium" | "large";
type AppView = "home" | "conversation" | "font-background";

function RobotAvatar({
  size = 34,
  home = false,
  account = false,
}: {
  size?: number;
  home?: boolean;
  account?: boolean;
}) {
  const scale = size / 44;
  const assets = home
    ? ["03a89", "aee6e", "9feb3", "80d27", "36650", "951d2", "50382"]
    : account
      ? ["7547e", "e7e0f", "7c190", "78ccf", "50951", "d37a7", "97b64"]
      : ["7547e", "86644", "04c18", "3c0bd", "cb9d3", "96cb3", "033e6"];
  return (
    <span className={`robot-avatar ${home ? "robot-avatar--home" : ""}`} style={{ width: size, height: size }}>
      <img src={`${A}/${assets[0]}.svg`} alt="" className="robot-base" />
      <span className="robot-parts" style={{ transform: `scale(${scale})` }}>
        <img src={`${A}/${assets[1]}.svg`} alt="" className="robot-crown" />
        <img src={`${A}/${assets[2]}.svg`} alt="" className="robot-body" />
        <img src={`${A}/${assets[3]}.svg`} alt="" className="robot-brow robot-brow--left" />
        <img src={`${A}/${assets[3]}.svg`} alt="" className="robot-brow robot-brow--right" />
        <img src={`${A}/${assets[4]}.svg`} alt="" className="robot-eye robot-eye--left" />
        <img src={`${A}/${assets[5]}.svg`} alt="" className="robot-eye robot-eye--right" />
        <img src={`${A}/${assets[6]}.svg`} alt="" className="robot-mouth" />
      </span>
    </span>
  );
}

function ProfileAvatar() {
  return (
    <span className="profile-avatar" aria-hidden="true">
      <img src={`${A}/2de47.svg`} alt="" className="profile-avatar-base" />
      <img src={`${A}/f8423.svg`} alt="" className="profile-avatar-crown" />
      <img src={`${A}/423a5.svg`} alt="" className="profile-avatar-body" />
      <img src={`${A}/f7024.svg`} alt="" className="profile-avatar-brow profile-avatar-brow--left" />
      <img src={`${A}/f7024.svg`} alt="" className="profile-avatar-brow profile-avatar-brow--right" />
      <img src={`${A}/29c04.svg`} alt="" className="profile-avatar-eye profile-avatar-eye--left" />
      <img src={`${A}/cb19c.svg`} alt="" className="profile-avatar-eye profile-avatar-eye--right" />
      <img src={`${A}/7b232.svg`} alt="" className="profile-avatar-mouth" />
    </span>
  );
}

function AccountRobotAvatar({ size = 36 }: { size?: number }) {
  return (
    <span className="account-avatar" style={{ width: size, height: size }} aria-hidden="true">
      <span className="account-avatar-inner" style={{ transform: `scale(${size / 48})` }}>
        <img src={`${A}/7547e.svg`} alt="" className="account-avatar-base" />
        <img src={`${A}/e7e0f.svg`} alt="" className="account-avatar-crown" />
        <img src={`${A}/7c190.svg`} alt="" className="account-avatar-body" />
        <img src={`${A}/78ccf.svg`} alt="" className="account-avatar-brow account-avatar-brow--left" />
        <img src={`${A}/78ccf.svg`} alt="" className="account-avatar-brow account-avatar-brow--right" />
        <img src={`${A}/50951.svg`} alt="" className="account-avatar-eye account-avatar-eye--left" />
        <img src={`${A}/d37a7.svg`} alt="" className="account-avatar-eye account-avatar-eye--right" />
        <img src={`${A}/97b64.svg`} alt="" className="account-avatar-mouth" />
      </span>
    </span>
  );
}

function GreenAvatar({ size = 36 }: { size?: number }) {
  return (
    <span className="green-avatar" aria-hidden="true" style={{ width: size, height: size }}>
      <span className="green-avatar-inner" style={{ transform: `scale(${size / 48})` }}>
        <img src={`${A}/7547e.svg`} alt="" className="green-base" />
        <img src={`${A}/9f36c.svg`} alt="" className="green-face" />
        <img src={`${A}/67282.svg`} alt="" className="green-eye green-eye--right" />
        <img src={`${A}/97b52.svg`} alt="" className="green-eye green-eye--left" />
        <img src={`${A}/4143a.svg`} alt="" className="green-mouth" />
        <img src={`${A}/eff18.svg`} alt="" className="green-brow green-brow--left" />
        <img src={`${A}/eff18.svg`} alt="" className="green-brow green-brow--right" />
      </span>
    </span>
  );
}

function ProfileDrawer({
  open,
  darkMode,
  onClose,
  onDarkModeChange,
  onFontBackground,
}: {
  open: boolean;
  darkMode: boolean;
  onClose: () => void;
  onDarkModeChange: (enabled: boolean) => void;
  onFontBackground: () => void;
}) {
  const [activeProfile, setActiveProfile] = useState("Rishabh");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className={`drawer-layer ${open ? "drawer-layer--open" : ""}`} aria-hidden={!open}>
      <button className="drawer-backdrop" onClick={onClose} aria-label="Close profile menu" tabIndex={open ? 0 : -1} />
      <aside
        className={`profile-drawer ${darkMode ? "profile-drawer--dark" : ""}`}
        aria-label="Profile and theme settings"
        aria-modal="true"
        role="dialog"
      >
        <div className="drawer-content">
          <div className="drawer-top">
            <h2 className="drawer-title">Account Info</h2>
            <div className="drawer-profile-card">
              <ProfileAvatar />
              <div className="drawer-user-copy">
                  <strong>Rishabh Negi</strong>
                  <span>Grade 3</span>
              </div>
              <button className="drawer-icon-button" aria-label="Edit profile">
                <img src={`${A}/d0fad.svg`} alt="" />
              </button>
            </div>

            <h3 className="drawer-section-title">Switch account</h3>
            <div className="profile-list">
              {[
                { name: "Rishabh", avatar: "robot" },
                { name: "Rohan", avatar: "green" },
                { name: "Shivam", avatar: "green" },
              ].map((profile) => {
                const selected = activeProfile === profile.name;
                return (
                  <button
                    className={`profile-option ${selected ? "profile-option--selected" : ""}`}
                    key={profile.name}
                    onClick={() => setActiveProfile(profile.name)}
                    aria-pressed={selected}
                  >
                    <span className="profile-option-user">
                      {profile.avatar === "robot" ? <AccountRobotAvatar /> : <GreenAvatar />}
                      <span className="account-copy">
                        <strong>{profile.name}</strong>
                        {selected && <small>Current account</small>}
                      </span>
                    </span>
                    <img
                      src={`${A}/${selected ? "56b80" : "dc5c5"}.svg`}
                      alt=""
                      className="profile-radio"
                    />
                  </button>
                );
              })}
            </div>
            <button className="add-account">
              <span>Add Account</span>
              <img src={`${A}/eebb2.svg`} alt="" />
            </button>
          </div>

          <nav className="drawer-nav" aria-label="Profile options">
            <button className="drawer-nav-item">
              <img src={`${A}/8eb5e.svg`} alt="" className="drawer-action-icon" />
              <span>Plans and History</span>
              <img src={`${A}/7efcd.svg`} alt="" className="drawer-chevron" />
            </button>
            <button className="drawer-nav-item" onClick={onFontBackground}>
              <span className="drawer-action-icon drawer-action-icon--font">
                <img src={`${A}/d4b62.svg`} alt="" />
              </span>
              <span>Font &amp; Background</span>
              <img src={`${A}/7efcd.svg`} alt="" className="drawer-chevron" />
            </button>
            <div className="drawer-nav-item theme-row">
              <img src={`${A}/1bac2.svg`} alt="" className="drawer-action-icon" />
              <span>Theme Dark Mode</span>
              <button
                className={`theme-toggle ${darkMode ? "theme-toggle--on" : ""}`}
                onClick={() => onDarkModeChange(!darkMode)}
                role="switch"
                aria-checked={darkMode}
                aria-label="Dark mode"
              >
                <img src={`${A}/${darkMode ? "8e1c0" : "88897"}.svg`} alt="" />
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

function Home({ onStart, onProfile }: { onStart: () => void; onProfile: () => void }) {
  return (
    <main className="screen home-screen">
      <div className="home-header">
        <button className="plain-button back-home" aria-label="Go back">
          <img src={`${A}/46986.svg`} alt="" className="back-home-icon back-home-icon--light" />
          <img src={`${A}/104e3.svg`} alt="" className="back-home-icon back-home-icon--dark" />
        </button>
        <button className="profile-trigger" onClick={onProfile} aria-label="Open profile menu">
          <RobotAvatar size={44} home />
        </button>
      </div>

      <section className="welcome">
        <p>Welcome back, Rishabh</p>
        <h1>How can i help ?</h1>
      </section>

      <section className="topics" aria-labelledby="topic-title">
        <h2 id="topic-title">Pick something you’re curious about</h2>
        <div className="topic-grid">
          {topics.map((topic) => (
            <button className={`topic-card topic-card--${topic.tone}`} key={topic.title} onClick={onStart}>
              <img src={`${A}/${topic.icon}`} alt="" />
              <strong>{topic.title}</strong>
              <span>{topic.detail}</span>
            </button>
          ))}
        </div>
      </section>

      <button className="talk-cta" onClick={onStart}>
        <span>Let&apos;s Talk</span>
        <img src={`${A}/38eaf.svg`} alt="" />
      </button>
    </main>
  );
}

function FontBackgroundPage({
  background,
  fontSize,
  onBack,
  onSave,
}: {
  background: BackgroundChoice;
  fontSize: FontSizeChoice;
  onBack: () => void;
  onSave: (background: BackgroundChoice, fontSize: FontSizeChoice) => void;
}) {
  const [draftBackground, setDraftBackground] = useState(background);
  const [draftFontSize, setDraftFontSize] = useState(fontSize);
  const backgrounds: Array<{ id: BackgroundChoice; label: string; asset: string }> = [
    { id: "blue", label: "Blue", asset: "8afd3.png" },
    { id: "green", label: "Green", asset: "ae8f9.png" },
    { id: "pink", label: "Pink", asset: "5097c.png" },
  ];
  const fontSizes: Array<{ id: FontSizeChoice; label: string; pixels: number }> = [
    { id: "small", label: "Small", pixels: 14 },
    { id: "medium", label: "Medium", pixels: 16 },
    { id: "large", label: "Large", pixels: 18 },
  ];
  const selectedSize = fontSizes.find((item) => item.id === draftFontSize)!;

  return (
    <main className="appearance-screen">
      <header className="appearance-header">
        <button className="appearance-back" onClick={onBack} aria-label="Back to account settings">
          <img src={`${A}/9d775.svg`} alt="" />
        </button>
        <h1>Font &amp; Background</h1>
      </header>

      <div className="appearance-content">
        <section className="appearance-section preview-section">
          <h2>Your preview</h2>
          <div
            className={`appearance-preview appearance-preview--${draftBackground}`}
            style={{ "--preview-font-size": `${selectedSize.pixels}px` } as React.CSSProperties}
          >
            <div className="preview-message preview-message--didi">
              <DidiAvatar />
              <span>Hlo how r u...</span>
            </div>
            <div className="preview-message preview-message--user">
              <span>I am good</span>
              <AccountRobotAvatar size={34} />
            </div>
          </div>
        </section>

        <section className="appearance-section">
          <h3>Choose a background</h3>
          <div className="background-options">
            {backgrounds.map((option) => {
              const selected = draftBackground === option.id;
              return (
                <button
                  className={`background-option ${selected ? "background-option--selected" : ""}`}
                  key={option.id}
                  onClick={() => setDraftBackground(option.id)}
                  aria-pressed={selected}
                >
                  <span className="background-swatch" style={{ backgroundImage: `url(${A}/${option.asset})` }}>
                    <img src={`${A}/${selected ? "85235" : "dc5c5"}.svg`} alt="" />
                  </span>
                  <strong>{option.label}</strong>
                </button>
              );
            })}
          </div>
        </section>

        <section className="appearance-section font-size-section">
          <div className="font-size-heading">
            <h3>Font size</h3>
            <strong>
              {selectedSize.label} · {selectedSize.pixels} px
            </strong>
          </div>
          <div className="font-size-options">
            {fontSizes.map((option) => {
              const selected = draftFontSize === option.id;
              return (
                <button
                  className={`font-size-option ${selected ? "font-size-option--selected" : ""}`}
                  key={option.id}
                  onClick={() => setDraftFontSize(option.id)}
                  aria-pressed={selected}
                >
                  <span style={{ fontSize: `${option.pixels}px` }}>Aa</span>
                  <small>{option.label}</small>
                </button>
              );
            })}
          </div>
          <p>Applies to text in your lessons and chats.</p>
        </section>
      </div>

      <footer className="appearance-footer">
        <button className="save-preferences" onClick={() => onSave(draftBackground, draftFontSize)}>
          Save Changes
        </button>
        <button
          className="reset-preferences"
          onClick={() => {
            setDraftBackground("blue");
            setDraftFontSize("medium");
          }}
        >
          Reset to default
        </button>
      </footer>
    </main>
  );
}

function DidiAvatar() {
  return (
    <span className="didi-avatar">
      <img src={`${A}/avatar.png`} alt="AI Didi" />
    </span>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="message-row message-row--user">
      <div className="bubble bubble--user">{children}</div>
      <AccountRobotAvatar size={34} />
    </div>
  );
}

function DidiMessage({ children, continuation = false }: { children: React.ReactNode; continuation?: boolean }) {
  return (
    <div className={`message-row message-row--didi ${continuation ? "message-row--continuation" : ""}`}>
      {continuation ? <span className="avatar-spacer" /> : <DidiAvatar />}
      <div className="bubble bubble--didi">{children}</div>
    </div>
  );
}

function MuteIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.6 8.2v1.5a3.4 3.4 0 0 0 5.6 2.6M13.4 9.8V6.5a3.4 3.4 0 0 0-6.3-1.8M10 14.2v2.5M7.2 16.7h5.6M3 3l14 14" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <rect x="7" y="2.5" width="6" height="10" rx="3" />
      <path d="M4.8 9.5a5.2 5.2 0 0 0 10.4 0M10 14.7v2.5M7.2 17.2h5.6" />
    </svg>
  );
}

function Conversation({ onBack }: { onBack: () => void }) {
  const [muted, setMuted] = useState(false);
  const [stage, setStage] = useState(1);
  const [liveText, setLiveText] = useState("");
  const [elapsed, setElapsed] = useState(10);
  const recognitionRef = useRef<Recognition | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (muted || stage >= 7) return;
    const timer = window.setTimeout(() => setStage((value) => Math.min(value + 1, 7)), stage === 1 ? 950 : 1350);
    return () => window.clearTimeout(timer);
  }, [muted, stage]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [stage, liveText]);

  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!liveText) return;
    const timer = window.setTimeout(() => setLiveText(""), 2400);
    return () => window.clearTimeout(timer);
  }, [liveText]);

  useEffect(() => {
    if (muted) return;
    const RecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionApi) return;

    const recognition = new RecognitionApi();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1]?.[0]?.transcript ?? "";
      setLiveText(result);
    };
    recognition.onerror = () => setLiveText("");
    recognition.onend = () => {
      if (!muted) {
        try {
          recognition.start();
        } catch {
          // The browser may already be restarting recognition.
        }
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // Scripted motion remains available when microphone permission is unavailable.
    }
    return () => {
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [muted]);

  function toggleMute() {
    setMuted((value) => !value);
    setLiveText("");
  }

  const time = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <main className="screen conversation-screen">
      <header className="conversation-header">
        <button className="back-button" onClick={onBack} aria-label="Back to home">
          <img src={`${A}/9d775.svg`} alt="" className="back-icon back-icon--light" />
          <img src={`${A}/104e3.svg`} alt="" className="back-icon back-icon--dark" />
        </button>
        <span className="timer">{time}</span>
      </header>

      <div className="message-feed" ref={feedRef} aria-live="polite">
        {stage >= 1 && <DidiMessage>Hii</DidiMessage>}
        {stage >= 2 && <UserMessage>Hii</UserMessage>}
        {stage >= 3 && <UserMessage>what is Vegetables</UserMessage>}
        {stage >= 4 && (
          <DidiMessage>
            Sure! Vegetables are essential for a healthy diet. They are packed with vitamins, minerals, and fiber.
            Eating a variety of vegetables can help reduce the risk of chronic diseases and improve overall health.
            Would you like to know about specific types or benefits?
          </DidiMessage>
        )}
        {stage >= 5 && <UserMessage>Share video also</UserMessage>}
        {stage >= 6 && (
          <>
            <DidiMessage>
              <span>Here is the video</span>
              <button className="video-card" aria-label="Play vegetable video">
                <img src={`${A}/video-preview.png`} alt="Vegetables arranged on a table" />
                <span className="video-shade" />
                <span className="play-button">
                  <img src={`${A}/be3af.svg`} alt="" />
                </span>
              </button>
            </DidiMessage>
            <DidiMessage continuation>They are packed with vitamins, minerals, and fiber.</DidiMessage>
          </>
        )}
        {stage >= 7 && (
          <div className="message-row message-row--didi thinking-row">
            <DidiAvatar />
            <div className="thinking">
              <span>Thinking....</span>
            </div>
          </div>
        )}
        {liveText && !muted && (
          <div className="live-transcript" key={liveText}>
            <span className="live-dot" />
            {liveText}
          </div>
        )}
      </div>

      <div className={`voice-dock ${muted ? "voice-dock--muted" : ""}`}>
        <span className="voice-status">{muted ? "Muted" : liveText ? "Listening to you" : "Listening"}</span>
        <button className="voice-orb" onClick={toggleMute} aria-pressed={muted} aria-label={muted ? "Unmute" : "Mute"}>
          <span className="orb-image">
            <img src={`${A}/orb.png`} alt="" />
          </span>
          <span className="mic-badge">
            <MuteIcon muted={muted} />
          </span>
        </button>
      </div>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<AppView>("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem("ai-didi-theme") === "dark");
  const [background, setBackground] = useState<BackgroundChoice>(
    () => (window.localStorage.getItem("ai-didi-background") as BackgroundChoice | null) ?? "blue",
  );
  const [fontSize, setFontSize] = useState<FontSizeChoice>(
    () => (window.localStorage.getItem("ai-didi-font-size") as FontSizeChoice | null) ?? "medium",
  );

  useEffect(() => {
    window.localStorage.setItem("ai-didi-theme", darkMode ? "dark" : "light");
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem("ai-didi-background", background);
    window.localStorage.setItem("ai-didi-font-size", fontSize);
  }, [background, fontSize]);

  let page: React.ReactNode;
  if (view === "conversation") {
    page = <Conversation onBack={() => setView("home")} />;
  } else if (view === "font-background") {
    page = (
      <FontBackgroundPage
        background={background}
        fontSize={fontSize}
        onBack={() => setView("home")}
        onSave={(nextBackground, nextFontSize) => {
          setBackground(nextBackground);
          setFontSize(nextFontSize);
          setView("home");
        }}
      />
    );
  } else {
    page = <Home onStart={() => setView("conversation")} onProfile={() => setDrawerOpen(true)} />;
  }

  return (
    <div className={`app ${darkMode ? "dark" : ""} background-${background} font-${fontSize}`}>
      {page}
      <ProfileDrawer
        open={drawerOpen}
        darkMode={darkMode}
        onClose={() => setDrawerOpen(false)}
        onDarkModeChange={setDarkMode}
        onFontBackground={() => {
          setDrawerOpen(false);
          setView("font-background");
        }}
      />
    </div>
  );
}
