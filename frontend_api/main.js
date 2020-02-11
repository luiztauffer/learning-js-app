const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, net} = require('electron');

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

// Catch item:send_to_python sent from form
ipcMain.on('item:send_to_python', function(event, item){
  const request = net.request('http://localhost:5000/multiplicate/'+item)
  // const request = net.request({
  //   method: 'GET',
  //   protocol: 'https:',
  //   hostname: '127.0.0.1',
  //   port: 5000,
  //   path: '/'//multiplicate/8'
  // });
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
      // Parse chunk (buffer type)
      var chk = JSON.parse(chunk.toString());
      console.log(chk);
      console.log(chk.result+30.987)
      // Send response to be written on list
      mainWindow.webContents.send('item:read_from_python', chk.result);
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()
})

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
        label: 'Open new window',
        click(){
          createSecondaryWindow();
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
