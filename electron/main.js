const { app, BrowserWindow, nativeTheme } = require("electron");
const path = require("path");

const BG_DARK = "#06080B";
const BG_LIGHT = "#F1F2F7";

function currentBg() {
  return nativeTheme.shouldUseDarkColors ? BG_DARK : BG_LIGHT;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 700,
    title: "Broadcast Clock",
    titleBarStyle: "hiddenInset",
    backgroundColor: currentBg(),
  });
  win.setAspectRatio(1);
  win.loadFile(path.join(__dirname, "web", "index.html"));

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
