import { Employee } from '@/components/Modal/modal'
import { app, BrowserWindow, ipcMain, Menu, nativeTheme } from 'electron'
import { dialog } from 'electron'
import electronModeDev from 'electron-is-dev'
import path from 'path'
import { createExcelFile } from './excel/createExcelFile'

const dbFilePath = path.join(__dirname, '../src/model/database.ts')
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

const {
  getAdminFromSQLite,
  getUserFromSQLite,
  getRegistersFromSQLite,
  getDaysRegistersFromSQLite,
  postDataToSQlite,
  updatingTimeUser,
  deleteItemFromId,
  createNewUser,
  createNewRegister,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require(dbFilePath)

let win: BrowserWindow | null

const menu = Menu.buildFromTemplate([
  {
    label: 'Janela',
    submenu: [
      { label: 'Tela Inteira', role: 'togglefullscreen' },
      { label: 'Reiniciar', role: 'reload' },
      { label: 'Zoom -', role: 'zoomOut' },
      { label: 'Zoom +', role: 'zoomIn' },
      { label: 'Fechar', role: 'close' },
    ],
  },
])
Menu.setApplicationMenu(menu)

function createWindow() {
  const distPath = path.join(__dirname, '../dist')
  const publicPath = app.isPackaged
    ? distPath
    : path.join(distPath, '../public')

  win = new BrowserWindow({
    icon: path.join(publicPath, 'electron-vite.ico'),
    fullscreen: true, // Definindo para abrir em fullscreen
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  nativeTheme.shouldUseDarkColors
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())

    win?.webContents.insertCSS('body { background-color: white; }')
  })

  if (electronModeDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173/')
  } else {
    win.loadFile(path.join(distPath, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  win = null
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) createWindow()
})

app.on('ready', () => {
  createWindow()
})

interface DataCreateFile extends Employee {
  id: number
}

ipcMain.handle('create-file', async (event, data: DataCreateFile) => {
  try {
    const winCurrent = BrowserWindow.fromId(event.frameId)

    if (!winCurrent)
      throw new Error('Não foi possível achar o processo da interface')

    const result = await dialog.showSaveDialog(winCurrent, {
      title: 'Selecione um arquivo',
      filters: [
        { name: 'Spreadsheets', extensions: ['xlsx', 'xls', 'xlsb', 'csv'] },
      ],
    })

    if (result.filePath) {
      createExcelFile(result.filePath, data)
    }
    return { message: 'Arquivo salvo com sucesso' }
  } catch (err) {
    console.log(err)
    return false
  }
})

/*Database */

ipcMain.handle('getAdmin', async () => {
  return await getAdminFromSQLite()
})
//getUserFromSQLite
ipcMain.handle('getUsers', async () => {
  return await getUserFromSQLite()
})
ipcMain.on('postData', (event, param1, param2, param3) => {
  event.sender
  postDataToSQlite(param1, param2, param3)
})

ipcMain.handle('createUser', async (event, name, workload, workingTime) => {
  event.sender
  const result = await createNewUser({ name, workload, workingTime })
  return result
})

ipcMain.handle('deleteData', (event, id) => {
  event.sender
  deleteItemFromId(id)
  return { id }
})

ipcMain.handle('getRegister', async () => {
  try {
    return await getRegistersFromSQLite()
  } catch (error) {
    // eslint-disable-next-line
    // @ts-ignore
    throw new Error(error.message)
  }
})

//updatingTimeUser

interface updatingUserTime {
  userId: string
  timeCurrent: string
  selectOption: string
  day: string
  month: string
  year: string
}

ipcMain.handle('updatingUser', async (event, updading: updatingUserTime) => {
  event.sender
  try {
    return await updatingTimeUser({ ...updading })
  } catch (error) {
    // eslint-disable-next-line
    // @ts-ignore
    throw new Error(error.message)
  }
})

interface CreateRegisterData {
  userId: number
  timeCurrent: string
  created_at: string
  selectOption: string
  day: string
  month: string
  year: string
}

ipcMain.handle(
  'create-register',
  async (event, register: CreateRegisterData) => {
    event.sender
    try {
      return await createNewRegister({ ...register })
    } catch (error) {
      // eslint-disable-next-line
      // @ts-ignore
      throw new Error(error.message)
    }
  },
)

interface IDaysDate {
  day: string
  month: string
  year: string
}

ipcMain.handle('getGegisterDay', async (event, daysDate: IDaysDate) => {
  event.sender
  try {
    return await getDaysRegistersFromSQLite({ ...daysDate })
  } catch (error) {
    // eslint-disable-next-line
    // @ts-ignore
    throw new Error(error.message)
  }
})
