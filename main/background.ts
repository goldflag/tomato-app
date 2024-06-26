import electron, { app, ipcMain, Menu } from "electron";
import serve from "electron-serve";
import path from "path";
import { setupRevUtils } from "rev-utils";
import { createWindow } from "./helpers";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1600,
    height: 900,
    minHeight: 900,
    minWidth: 1600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("https://tomato.gg");

  mainWindow.setTitle("Tomato.gg");

  mainWindow.on("page-title-updated", (event) => {
    event.preventDefault();
  });

  // Define the menu template
  const menuTemplate = [
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click() {
            mainWindow.reload();
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "CmdOrCtrl+Shift+I",
          click() {
            mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    },
  ];

  // Set the application menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.setMenuBarVisibility(false);

  // if (isProd) {
  //   await mainWindow.loadURL('app://./home')
  // } else {
  //   const port = process.argv[2]
  //   await mainWindow.loadURL(`http://localhost:${port}/home`)
  //   mainWindow.webContents.openDevTools()
  // }

  setupRevUtils(mainWindow, electron);
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("message", async (event, arg) => {
  event.reply("message", `${arg} World!`);
});
