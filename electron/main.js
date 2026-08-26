const { app, BrowserWindow, nativeTheme, Menu } = require("electron");
const path = require("path");
const Store = require("electron-store");

const store = new Store({
  defaults: {
    timeFormat: "hhmmss",
    theme: null, // null = follow system, "light"/"dark" = override
    color: 222,
    alwaysOnTop: false,
  },
});

const BG_DARK = "#06080B";
const BG_LIGHT = "#F1F2F7";

function currentBg() {
  return nativeTheme.shouldUseDarkColors ? BG_DARK : BG_LIGHT;
}

function setTimeFormat(win, format) {
  store.set("timeFormat", format);
  win.webContents.executeJavaScript(
    `document.documentElement.setAttribute("data-format", ${JSON.stringify(format)})`
  );
}

// null = follow the system (see the nativeTheme "updated" handler in
// createWindow); "light"/"dark" = user override from the menu below.
function setTheme(win, theme, state) {
  store.set("theme", theme);
  state.themeOverride = theme;
  if (theme === null) {
    win.webContents.executeJavaScript(
      `document.documentElement.removeAttribute("data-theme")`
    );
    win.setBackgroundColor(currentBg());
  } else {
    win.webContents.executeJavaScript(
      `document.documentElement.setAttribute("data-theme", ${JSON.stringify(theme)})`
    );
    win.setBackgroundColor(theme === "dark" ? BG_DARK : BG_LIGHT);
  }
}

function setColor(win, hue) {
  store.set("color", hue);
  win.webContents.executeJavaScript(
    `document.documentElement.style.setProperty("--c", ${JSON.stringify(String(hue))})`
  );
}

function applyStoredSettings(win, state) {
  const { timeFormat, theme, color } = store.store;
  win.webContents.executeJavaScript(`
    document.documentElement.setAttribute("data-format", ${JSON.stringify(timeFormat)});
    document.documentElement.style.setProperty("--c", ${JSON.stringify(String(color))});
    ${theme
      ? `document.documentElement.setAttribute("data-theme", ${JSON.stringify(theme)});`
      : `document.documentElement.removeAttribute("data-theme");`}
  `);
  state.themeOverride = theme;
  win.setBackgroundColor(theme ? (theme === "dark" ? BG_DARK : BG_LIGHT) : currentBg());
}

function buildMenu(win, state) {
  const settings = store.store;
  const menu = Menu.buildFromTemplate([
    { role: "appMenu" },
    {
      label: "View",
      submenu: [
        {
          label: "HH:MM:SS",
          type: "radio",
          checked: settings.timeFormat === "hhmmss",
          click: () => setTimeFormat(win, "hhmmss"),
        },
        {
          label: "HH:MM",
          type: "radio",
          checked: settings.timeFormat === "hhmm",
          click: () => setTimeFormat(win, "hhmm"),
        },
        { type: "separator" },
        {
          label: "Theme: System",
          type: "radio",
          checked: settings.theme === null,
          click: () => setTheme(win, null, state),
        },
        {
          label: "Theme: Light",
          type: "radio",
          checked: settings.theme === "light",
          click: () => setTheme(win, "light", state),
        },
        {
          label: "Theme: Dark",
          type: "radio",
          checked: settings.theme === "dark",
          click: () => setTheme(win, "dark", state),
        },
        { type: "separator" },
        {
          label: "Color: Blue",
          type: "radio",
          checked: settings.color === 222,
          click: () => setColor(win, 222),
        },
        {
          label: "Color: Red",
          type: "radio",
          checked: settings.color === 10,
          click: () => setColor(win, 10),
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        {
          label: "Always on Top",
          type: "checkbox",
          accelerator: "CmdOrCtrl+T",
          checked: settings.alwaysOnTop,
          click: (menuItem) => {
            store.set("alwaysOnTop", menuItem.checked);
            win.setAlwaysOnTop(menuItem.checked);
          },
        },
        { type: "separator" },
        { role: "minimize" },
        { role: "close" },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 300,
    title: "Broadcast Clock",
    titleBarStyle: "hiddenInset",
    backgroundColor: currentBg(),
  });
  win.setAspectRatio(1);
  win.setAlwaysOnTop(store.get("alwaysOnTop"));
  win.loadFile(path.join(__dirname, "web", "index.html"));

  const state = { themeOverride: store.get("theme") };
  win.webContents.on("did-finish-load", () => applyStoredSettings(win, state));
  buildMenu(win, state);

  nativeTheme.on("updated", () => {
    if (state.themeOverride === null) {
      win.setBackgroundColor(currentBg());
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
