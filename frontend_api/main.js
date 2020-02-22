const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, net, dialog} = require('electron');

let mainWindow;
let secondary;

// Creates mainWindow
function createMainWindow(){
  // Create a new window instance
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true
    }
  });

  // Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open Devtools
  // mainWindow.webContents.openDevTools();

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu)

  // Qui app when closed
  mainWindow.on('closed', function(){
    app.quit()
  })
}

// Creates secondaryWindow
function createSecondaryWindow(){
  // Create a new window instance
  secondaryWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'A secondary window',
    webPreferences: {
        nodeIntegration: true
    }
  });

  // Load html into window
  secondary.loadURL(url.format({
    pathname: path.join(__dirname, 'secondary.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Garbage collector
  secondary.on('close', function(){
    secondary = null;
  })
}

// Opens File Dialog
function openFileDialog(){
  const file = dialog.showOpenDialogSync(mainWindow, {
    title: 'Open data file',
    properties: ['openFile'],
    filters: [
      { name: 'Data files', extensions: ['csv'] },
    ],
  })
  // If no file selected, just return
  if (!file) return;
  // If a file was selected, send it to backend
  console.log(`Sending ${file} to backend server...`)
  const request = net.request('http://localhost:5000/plotdatapoint/'+item)
}

// Catch item:send_to_python sent from form
ipcMain.on('item:send_to_python', function(event, item){
  // const request = net.request('http://localhost:5000/storecsvdata')
  const request = net.request({
    method: 'POST',
    protocol: 'http:',
    hostname: 'localhost',
    port: 5000,
    path: '/storecsvdata',
    headers: {
          'Content-Type': 'text/csv',
          'Content-Length': postData.length
        }
  });

  request.end()
})

// Catch item:add sent from secondary form button
ipcMain.on('item:add', function(event, item){
  mainWindow.webContents.send('item:add', item);
  // secondary.close();
});

// Catch item:add sent from secondary form button
ipcMain.on('item:add', function(event, item){
  mainWindow.webContents.send('item:add', item);
  // secondary.close();
});



// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open File',
        click(){
          openFileDialog();
        }
      },
      {
        label: 'Clear items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Quit',
        click(){
          app.quit();
        }
      },
    ]
  },
];

// Listen for app to be ready
app.on('ready', createMainWindow);

// Add developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
