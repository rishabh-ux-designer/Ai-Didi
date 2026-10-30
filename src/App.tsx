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

function RobotAvatar({ size = 34, home = false, drawer = false }: { size?: number; home?: boolean; drawer?: boolean }) {
  const scale = size / 44;
  return (
    <span className={`robot-avatar ${home ? "robot-avatar--home" : ""}`} style={{ width: size, height: size }}>
      <img src={`${A}/${home ? "03a89" : drawer ? "cc7e4" : "7547e"}.svg`} alt="" className="robot-base" />
      <span className="robot-parts" style={{ transform: `scale(${scale})` }}>
        <img src={`${A}/${home ? "aee6e" : "86644"}.svg`} alt="" className="robot-crown" />
        <img src={`${A}/${home ? "9feb3" : "04c18"}.svg`} alt="" className="robot-body" />
        <img src={`${A}/${home ? "80d27" : "3c0bd"}.svg`} alt="" className="robot-brow robot-brow--left" />
        <img src={`${A}/${home ? "80d27" : "3c0bd"}.svg`} alt="" className="robot-brow robot-brow--right" />
        <img src={`${A}/${home ? "36650" : "cb9d3"}.svg`} alt="" className="robot-eye robot-eye--left" />
        <img src={`${A}/${home ? "951d2" : "96cb3"}.svg`} alt="" className="robot-eye robot-eye--right" />
        <img src={`${A}/${home ? "50382" : "033e6"}.svg`} alt="" className="robot-mouth" />
      </span>
    </span>
  );
}

function GreenAvatar() {
  return (
    <span className="green-avatar" aria-hidden="true">
      <img src={`${A}/cc7e4.svg`} alt="" className="green-base" />
      <img src={`${A}/fa2e2.svg`} alt="" className="green-face" />
      <img src={`${A}/c8ca7.svg`} alt="" className="green-eye green-eye--right" />
      <img src={`${A}/11f3f.svg`} alt="" className="green-eye green-eye--left" />
      <img src={`${A}/01bf6.svg`} alt="" className="green-mouth" />
      <img src={`${A}/9a2aa.svg`} alt="" className="green-brow green-brow--left" />
      <img src={`${A}/9a2aa.svg`} alt="" className="green-brow green-brow--right" />
    </span>
  );
}

function ProfileDrawer({
  open,
  darkMode,
  onClose,
  onDarkModeChange,
}: {
  open: boolean;
  darkMode: boolean;
  onClose: () => void;
  onDarkModeChange: (enabled: boolean) => void;
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
            <div className="drawer-current-profile">
              <div className="drawer-current-user">
                <RobotAvatar size={44} home />
                <div className="drawer-user-copy">
                  <strong>Rishabh</strong>
                  <span>Grade 3</span>
                </div>
              </div>
              <button className="drawer-icon-button" aria-label="Edit profile">
                <img src={`${A}/${darkMode ? "6c5a1" : "c2cee"}.svg`} alt="" />
              </button>
            </div>

            <div className="profile-list">
              {[
                { name: "Rishabh", avatar: "robot" },
                { name: "Rohan", avatar: "green" },
                { name: "Shivam", avatar: "green" },
              ].map((profile) => {
                const selected = activeProfile === profile.name;
                return (
                  <button
                    className="profile-option"
                    key={profile.name}
                    onClick={() => setActiveProfile(profile.name)}
                    aria-pressed={selected}
                  >
                    <span className="profile-option-user">
                      {profile.avatar === "robot" ? <RobotAvatar size={34} drawer /> : <GreenAvatar />}
                      <span>{profile.name}</span>
                    </span>
                    <img
                      src={`${A}/${darkMode ? (selected ? "3d536" : "194f3") : selected ? "e8d5a" : "c4f05"}.svg`}
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
              <img src={`${A}/${darkMode ? "f8019" : "f1a78"}.svg`} alt="" className="plans-icon" />
              <span>Plans and History</span>
            </button>
            <div className="drawer-nav-item theme-row">
              <span className="theme-label">
                <img src={`${A}/${darkMode ? "3d5bf" : "85f3a"}.svg`} alt="" />
                <span>Theme Dark Mode</span>
              </span>
              <button
                className={`theme-toggle ${darkMode ? "theme-toggle--on" : ""}`}
                onClick={() => onDarkModeChange(!darkMode)}
                role="switch"
                aria-checked={darkMode}
                aria-label="Dark mode"
              >
                <img src={`${A}/${darkMode ? "8e1c0" : "83db2"}.svg`} alt="" />
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
      <RobotAvatar />
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
        {stage >= 1 && <UserMessage>Hii</UserMessage>}
        {stage >= 2 && <DidiMessage>Hii</DidiMessage>}
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
  const [view, setView] = useState<"home" | "conversation">("home");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => window.localStorage.getItem("ai-didi-theme") === "dark");

  useEffect(() => {
    window.localStorage.setItem("ai-didi-theme", darkMode ? "dark" : "light");
    document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {view === "home" ? (
        <Home onStart={() => setView("conversation")} onProfile={() => setDrawerOpen(true)} />
      ) : (
        <Conversation onBack={() => setView("home")} />
      )}
      <ProfileDrawer
        open={drawerOpen}
        darkMode={darkMode}
        onClose={() => setDrawerOpen(false)}
        onDarkModeChange={setDarkMode}
      />
    </div>
  );
}
