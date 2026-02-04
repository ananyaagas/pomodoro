const { app, BrowserWindow, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

/**
 * Create the main application window
 * Handles both development and production environments
 */
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Pomodoro Valentine',
        width: 400,
        height: 400,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            // Enable web security in production
            webSecurity: true,
        }
    });

    // Path resolution for both development and production
    // In production (ASAR), __dirname points to app.asar/electron/
    // We need to go up one level to reach build/
    const startUrl = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true,
    });

    // Hide native window controls (macOS traffic lights)
    if (process.platform === 'darwin') {
        mainWindow.setWindowButtonVisibility(false);
    }
    
    // Hide menu bar on all platforms
    mainWindow.setMenuBarVisibility(false);

    // Load the React application
    mainWindow.loadURL(startUrl);

    // Open DevTools in development only
    if (process.env.ELECTRON_DEV === 'true') {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    // Handle window close event
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Prevent navigation away from the app
    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        // Allow file protocol for local resources
        if (parsedUrl.protocol !== 'file:') {
            event.preventDefault();
        }
    });
}

/**
 * IPC Event Handlers
 * These handle communication from the renderer process
 */

// Minimize window
ipcMain.on('window-minimize', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.minimize();
    }
});

// Close window and quit app
ipcMain.on('window-close', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.close();
    }
});

/**
 * App Lifecycle Events
 */

// Create window when app is ready
app.whenReady().then(() => {
    createMainWindow();

    // macOS: Re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Handle app quit
app.on('before-quit', () => {
    // Cleanup if needed
    if (mainWindow) {
        mainWindow.removeAllListeners('close');
    }
});