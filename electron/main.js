const { app, BrowserWindow, nativeTheme, Menu } = require("electron");
const path = require("path");

const BG_DARK = "#06080B";
const BG_LIGHT = "#F1F2F7";

function currentBg() {
  return nativeTheme.shouldUseDarkColors ? BG_DARK : BG_LIGHT;
}

function setTimeFormat(win, format) {
  win.webContents.executeJavaScript(
    `document.documentElement.setAttribute("data-format", ${JSON.stringify(format)})`
  );
}

function buildMenu(win) {
  const menu = Menu.buildFromTemplate([
    { role: "appMenu" },
    {
      label: "View",
      submenu: [
        {
          label: "HH:MM:SS",
          type: "radio",
          checked: true,
          click: () => setTimeFormat(win, "hhmmss"),
        },
        {
          label: "HH:MM",
          type: "radio",
          checked: false,
          click: () => setTimeFormat(win, "hhmm"),
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
          checked: false,
          click: (menuItem) => win.setAlwaysOnTop(menuItem.checked),
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
  win.loadFile(path.join(__dirname, "web", "index.html"));
  buildMenu(win);

  nativeTheme.on("updated", () => {
    win.setBackgroundColor(currentBg());
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
