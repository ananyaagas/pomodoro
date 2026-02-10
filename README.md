# 🦊💝🦥 My Nerdy Valentine

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-pink.svg)
![Electron](https://img.shields.io/badge/electron-40.1.0-blue.svg)
![React](https://img.shields.io/badge/react-19.2.4-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-4.9.5-blue.svg)

[The Vibe](#-a-little-use-case) • [What It Does](#-core-features) • [How to Run It](#-installation--development) • [Nerd Alert](#-curiosity-killed-the-cat)

</div>
<div align="center">

**Made for 🦊 By 🦥**

</div>

---

## 🌸 A Little Use Case

### Who This Is For

You are the smartest engineer in the world, but you still need something gentle to help you focus. You want a timer that stays out of your way, lives quietly on your desktop, and makes study time feel less lonely.

---

### What This App Does

**Pomodoro Valentine** is a small desktop timer I made just for you to make study time feel a bit sweeter. You start the timer, and while it counts down a tiny fox walks in from one side and a sleepy sloth rolls in from the other, both slowly making their way toward each other. When time is up, they meet in the middle and have a little celebration.

It is meant to feel encouraging, not demanding. Like a soft check-in instead of a loud alarm.

---

### How a Session Flows

```
1. Open the app and see a small, cozy window
2. Click "WORK" and watch the fox and sloth appear on opposite sides
3. Click "START" to begin a 25-minute focus session
4. As time passes, they slowly move toward each other
5. When the timer reaches zero, they meet and celebrate
6. The app switches to break mode automatically
7. Click "START" again when you are ready, and repeat
```

---

### 🎯 Core Features

| Feature                         | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| **Dual-Mode Timer**             | 25-minute work sessions, 5-minute break intervals             |
| **Progress-Based Storytelling** | Animals move linearly—meeting exactly at 100% completion      |
| **Dynamic Messaging**           | Motivational text changes every 20% of timer progress         |
| **Environmental Transitions**   | Sky gradients shift from blue (work) to pink/lavender (break) |
| **Celebration Mechanics**       | 3-second confetti animation with automatic mode switching     |
| **Frameless Window**            | Custom transparent shell with no native OS chrome             |
| **Custom Controls**             | In-app minimize, close, and reset buttons via IPC             |

---

### Tech Stack

```
Frontend:       React 19 (TSX) + TypeScript 4.9
Shell:          Electron 40.1.0 (Main + Renderer Processes)
Build Tool:     Create React App (react-scripts 5.0.1)
Bundler:        electron-builder 25.1.8
Styling:        Pure CSS3 (Animations + Gradients)
Asset Format:   PNG, GIF (Pixel Art), OTF (Custom Font)
```

## 📦 Dependency Breakdown

### Production Dependencies

| Package         | Version | Purpose                              |
| --------------- | ------- | ------------------------------------ |
| `react`         | 19.2.4  | UI component library                 |
| `react-dom`     | 19.2.4  | React → DOM binding                  |
| `react-scripts` | 5.0.1   | CRA build toolchain (Webpack, Babel) |
| `typescript`    | 4.9.5   | Type checking + TSX compilation      |
| `web-vitals`    | 2.1.4   | Performance metrics (optional)       |

### Development Dependencies

| Package              | Version | Purpose                               |
| -------------------- | ------- | ------------------------------------- |
| `electron`           | 40.1.0  | Desktop shell runtime                 |
| `electron-builder`   | 25.1.8  | Cross-platform app packager           |
| `@types/*`           | Various | TypeScript definitions for Node/React |
| `@testing-library/*` | Various | Component testing utilities           |

---

## 🚀 Installation & Development

### Prerequisites

- **Node.js:** `v20.15.0` or higher
- **npm:** `v10.7.0` or higher
- **macOS:** 10.13+ (for DMG distribution)
- **Windows:** 7+ (for NSIS installer)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/pomodoro-valentine.git
cd pomodoro-valentine

# Install dependencies
npm install

# Start React development server
npm start
# → Opens http://localhost:3000 in browser

# Run in Electron (development mode)
npm run electron-dev
# → Opens frameless window with DevTools

# Build & Run (production test)
npm run electron
# → Builds React app, then launches Electron
```

---

## 🚀 Installation Steps

The installers are generated in the `dist/` directory. To generate them, run the following command from the project root:

```bash
npm run dist

```

---

### 🍎 macOS

**Output:** `dist/Pomodoro Valentine-1.0.0.dmg`

#### ⚠️ First-time Setup (Important)

The icon **must** live in the assets folder:

`assets/icon.icns`

> **Note:** Do not put icons in `/build` — React deletes that folder every time a new build is initiated.

#### How to Install

1. **Open** the `.dmg` file.
2. **Drag** the app into your **Applications** folder.
3. **Right-click → Open** the first time (the macOS security warning is normal for unsigned builds).

---

### 🪟 Windows

**Output:** `dist/Pomodoro Valentine Setup.exe`

#### Icon Requirement

Ensure the Windows icon exists at:

`assets/icon.ico`

#### Build Command

```bash
npm run dist:win

```

Run the resulting `.exe` installer normally to complete the setup.

---

### 🔁 Rebuilding

If the build looks outdated or cached, perform a clean wipe of the distribution folder:

```bash
rm -rf dist
npm run dist

```


---

## 🐱 Curiosity killed the cat!

Everything above is all you really need to know to use the app.

Everything below is for when you are in the mood to poke around, since I know you are _the_ mega nerd on earth. Special thanks to Chat GPT for the formatting of this readme, it was looking quite dire in the beginning.

### Architecture Diagram

At a high level, this is how the Electron and React pieces talk to each other.

```

┌─────────────────────────────────────────────────────────────┐
│ ELECTRON MAIN PROCESS │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ electron/main.js │ │
│ │ • Creates BrowserWindow (400×400, frameless) │ │
│ │ • Loads build/index.html (file:// protocol) │ │
│ │ • Registers IPC handlers (minimize, close) │ │
│ └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
│
│ IPC Bridge (contextBridge)
│
┌──────────────────────────▼──────────────────────────────────┐
│ ELECTRON RENDERER PROCESS │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ preload.js (Security Layer) │ │
│ │ • Exposes window.electron.minimize() │ │
│ │ • Exposes window.electron.close() │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ src/App.tsx (React Component) │ │
│ │ • Timer Logic (useEffect + setInterval) │ │
│ │ • State Management (useState hooks) │ │
│ │ • Progress Calculation (animalProgress = 1-time/total)│ │
│ │ • Dynamic Asset Imports (Webpack bundling) │ │
│ └────────────────────────────────────────────────────────┘ │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ src/App.css (Visual Layer) │ │
│ │ • Keyframe Animations (@keyframes drift) │ │
│ │ • Conditional Classes (.app.work, .app.break) │ │
│ │ • Transform-based Movement (translateX) │ │
│ └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

```

---

## Implementation Deep Dive

This is the part where we gently lift the hood and look at how everything works. Nothing here is required reading, but if you like knowing _why_ things behave the way they do, this is for you.

---

### Timer State Management

Everything in the app revolves around a single countdown timer. The remaining time is the source of truth, and every other piece of state reacts to it.

```typescript
const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
const [isRunning, setIsRunning] = useState(false);
const [isBreak, setIsBreak] = useState(false);
const [isCelebrating, setIsCelebrating] = useState(false);
```

The timer itself ticks once per second using a `useEffect`. When it is not running, or when time hits zero, the interval simply does not exist.

```typescript
useEffect(() => {
  if (!isRunning || timeLeft <= 0) return;
  const timer = setInterval(() => setTimeLeft((p) => Math.max(0, p - 1)), 1000);
  return () => clearInterval(timer);
}, [isRunning, timeLeft]);
```

This keeps things predictable and avoids runaway intervals or stale state hanging around in the background.

---

### Progress is more important than seconds

Instead of basing visuals on raw time, the app converts time into progress. Progress is just a number between zero and one that represents how far through the session you are.

```typescript
const totalTime = isBreak ? BREAK_DURATION : WORK_DURATION;
const progress = 1 - timeLeft / totalTime;
```

That single value drives almost everything.

The fox's and the sloth's positions are calculated directly from progress, so they always move at the right pace and always meet exactly in the middle when the timer ends.

```typescript
const MEET_DISTANCE = 110;
const animalProgress = isCelebrating ? 1 : progress;
```

This actually was an issue bc they were overlapping for a bit and that was funny.

---

### Messages as little checkpoints

Motivational messages are tied to progress ranges instead of exact timestamps. The session is divided into five equal chunks, and each chunk maps to one message.

```typescript
const messageIndex = Math.min(
  Math.floor(progress * messages.length),
  messages.length - 1
);
```

This keeps the messages evenly spaced and I like to think I know what you're doing in those 5 minute breaks, so hopefully I say the right thing <3 .

---

### Celebration tiiiime

When the timer reaches zero, a few things happen in a very specific order.

```typescript
useEffect(() => {
  if (timeLeft === 0 && isRunning) {
    setIsRunning(false);
    setIsCelebrating(true);

    const t = setTimeout(() => {
      setIsCelebrating(false);
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? WORK_DURATION : BREAK_DURATION);
    }, 3000);

    return () => clearTimeout(t);
  }
}, [timeLeft, isRunning, isBreak]);
```

The app pauses the timer, shows a short celebration, switches modes, and then resets the clock. Separating these steps makes the transition feel calm instead of abrupt.

`Timer Expires` → `Confetti (3s)` → `Mode Switch` → `Ready for Next Session`

---

## 🎨 Now the fun stuff !

The world changes with your mood

The background shifts depending on whether you are working or taking a break. The layout stays the same, but the atmosphere changes.

During work time, everything feels bright and daytime-y:

.app.work {
background-color: #9fd3ff;
}

During break time, the colors soften into a warm sunset gradient:

.app.break {
background: linear-gradient(
to bottom,
#ffb3c6 0%,
#ffd6a5 45%,
#cdb4db 100%
);
}

The goal is not to distract you, just to gently signal what kind of time it is.

Movement that stays out of the way

All the motion in the app is handled with CSS transforms and transitions rather than JavaScript animation loops.

.animal {
transition: transform 1s ease-out;
}

.cloud {
animation: drift 70s linear infinite;
}

@keyframes drift {
to {
transform: translateX(600px);
}
}

This keeps everything smooth and lightweight. The browser can handle the heavy lifting, and the app stays responsive even while the timer is ticking.

Behind the scenes, this also helps performance. Transform-based animations avoid layout recalculation, which keeps the one-second timer updates feeling steady instead of jittery.

---

Here’s a **cute-but-still-smart rewrite** that keeps all the technical meat, preserves your code blocks, and makes the explanations feel friendlier and more conversational. This should slot right in after the design section without feeling like a tone shift.

---

## 🧵 How the App Talks to Itself (IPC)

Because this is an Electron app, it lives in two worlds at once.

One part is the main process, which controls the actual desktop window.
The other part is the renderer, which is basically the React app running in a browser-like environment.

These two are not allowed to talk to each other directly, so they pass notes through a small, very controlled bridge.

---

### The tiny bridge in between

That bridge lives in the preload script. Its whole job is to expose a few safe actions that the UI is allowed to use.

```javascript
// electron/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  minimize: () => ipcRenderer.send("window-minimize"),
  close: () => ipcRenderer.send("window-close"),
});
```

Nothing fancy here. Just a couple of buttons the app is allowed to press.

---

### Using it from React

From the React side, these functions show up as methods on `window.electron`. Before calling them, the app checks that the bridge exists.

```typescript
const handleMinimize = () => {
  if (window.electron) {
    window.electron.minimize();
  }
};
```

This keeps the UI clean and prevents it from reaching into places it should not.

---

### What happens on the other side

When one of those messages is sent, the main process listens for it and does the actual window work.

```javascript
// electron/main.js
ipcMain.on("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window-close", () => {
  if (mainWindow) mainWindow.close();
});
```

The React app asks nicely.
The main process does the heavy lifting.

---

## 🧰 A Quick Look at the Build Setup

Most of the packaging behavior is defined in `package.json`. This tells Electron Builder what to include, how to bundle it, and where to put the final app.

```json
{
  "build": {
    "appId": "com.valentine.pomodoro",
    "productName": "Pomodoro Valentine",
    "asar": true,
    "directories": {
      "buildResources": "build",
      "output": "dist"
    },
    "files": ["build/**/*", "electron/**/*", "package.json"],
    "extraMetadata": {
      "main": "electron/main.js"
    }
  }
}
```

The main process then loads the built React app using a file path that works both during development and once everything is packaged up.

```javascript
const startUrl = url.format({
  pathname: path.join(__dirname, "../build/index.html"),
  protocol: "file:",
  slashes: true,
});
```

---

## 📚 Extra! Extra! Read All About It!

If you ever want to dig deeper, these are some of the things I _heavily_ leaned on while building this.

### Where the idea started

- [Work Faster – A Cute Pomodoro Timer App with React + Electron](http://github.com/lovesulei/work_faster/tree/main)

### Electron things I kept open in way too many tabs

- [Main and Renderer Processes](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
- [IPC Communication](https://www.electronjs.org/docs/latest/tutorial/ipc)

### React patterns that show up everywhere here

- [Hooks Dependency Arrays](https://react.dev/reference/react/useEffect#specifying-reactive-dependencies)
- [Derived State](https://react.dev/learn/you-might-not-need-an-effect#updating-state-based-on-props-or-state)

### Packaging and shipping the whole thing

- [Electron Builder Configuration](https://www.electron.build/configuration/configuration)
- [Code Signing on macOS](https://www.electron.build/code-signing)
- [Auto Updates](https://www.electron.build/auto-update)

## 🤝 About Reusing This

This started as a Valentine’s Day project, but if you want to clone it, poke around, or build your own version, feel free. Just be nice to it.
