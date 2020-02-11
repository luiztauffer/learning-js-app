const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain, net} = require('electron');

let mainWindow;
let addWindow;

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

// Creates addWindow
function createAddWindow(){
  // Create a new window instance
  addWindow = new BrowserWindow({
    width: 400,
    height: 300,
    title: 'Add new item',
    webPreferences: {
        nodeIntegration: true
    }
  });

  // Load html into window
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Garbage collector
  addWindow.on('close', function(){
    addWindow = null;
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
      // console.log(JSON.stringify(chunk.result))
      // Send response to be written on list
      // console.log(`BODY: ${chunk}['result']`)
      // ipcRenderer.send('item:read_from_python', chunk['result']);
    })
    response.on('end', () => {
      console.log('No more data in response.')
    })
  })
  request.end()
})

// Catch item:add sent from addWindow form button
ipcMain.on('item:add', function(event, item){
  mainWindow.webContents.send('item:add', item);
  // addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add item',
        click(){
          createAddWindow();
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
