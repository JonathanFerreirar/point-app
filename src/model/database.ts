/* eslint-disable */
// @ts-nocheck
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbFilePath = path.join(__dirname, 'app-point.db')

async function getAdminFromSQLite() {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, err => {
      if (err) {
        console.error('Here', err.message)
        reject(err)
      } else {
        console.log('')
      }
    })

    const data = []

    db.serialize(() => {
      db.each(
        `SELECT *
        FROM Admins`,
        // eslint-disable-next-line
        // @ts-ignore
        (err, row) => {
          if (err) {
            console.error(err.message)
            reject(err)
          } else {
            // eslint-disable-next-line
            // @ts-ignore
            data.push(row)
          }
        },
        () => {
          // eslint-disable-next-line
          // @ts-ignore
          db.close(err => {
            if (err) {
              console.error(err.message)
              reject(err)
            } else {
              // eslint-disable-next-line
              // @ts-ignore
              resolve(data)
            }
          })
        },
      )
    })
  })
}

async function getUserFromSQLite() {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, err => {
      if (err) {
        console.error('Here', err.message)
        reject(err)
      } else {
        console.log('')
      }
    })

    const data = []

    db.serialize(() => {
      db.each(
        `SELECT *
        FROM users`,
        // eslint-disable-next-line
        // @ts-ignore
        (err, row) => {
          if (err) {
            console.error(err.message)
            reject(err)
          } else {
            // eslint-disable-next-line
            // @ts-ignore
            data.push(row)
          }
        },
        () => {
          // eslint-disable-next-line
          // @ts-ignore
          db.close(err => {
            if (err) {
              console.error(err.message)
              reject(err)
            } else {
              // eslint-disable-next-line
              // @ts-ignore
              resolve(data)
            }
          })
        },
      )
    })
  })
}

async function getRegistersFromSQLite() {
  return new Promise((resolve, reject) => {

    const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, err => {
      if (err) {
        console.error('Here', err.message)
        reject(err)
      } else {
        console.log('')
      }
    })

    const data = []

    db.serialize(() => {
      db.each(
        `SELECT *
        FROM registers`,
        // eslint-disable-next-line
        // @ts-ignore
        (err, row) => {
          if (err) {
            console.error(err.message)
            reject(err)
          } else {
            // eslint-disable-next-line
            // @ts-ignore
            data.push(row)
          }
        },
        () => {
          // eslint-disable-next-line
          // @ts-ignore
          db.close(err => {
            if (err) {
              console.error(err.message)
              reject(err)
            } else {
              // eslint-disable-next-line
              // @ts-ignore
              resolve(data)
            }
          })
        },
      )
    })
  })
}
// eslint-disable-next-line
              // @ts-ignore
async function postDataToSQlite(data, teste, saida) {
  const db = new sqlite3.Database(dbFilePath)

  db.run(
    `INSERT INTO data(data,teste, saida) VALUES(?, ?, ?)`,
    [data, teste, saida],
// eslint-disable-next-line
              // @ts-ignore
    function (err) {
      if (err) {
        return console.log(err.message)
      }
// eslint-disable-next-line
              // @ts-ignore
      console.log(`A row has been inserted with rowid ${this.lastID}`)
    },
  )
}
// eslint-disable-next-line
              // @ts-ignore
async function createNewUser({ name, workload, workingTime }) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFilePath)

    db.run(
      `INSERT INTO users(name, workload ,working_time) VALUES(?, ?, ?)`,
      [name, workload, workingTime],
      // eslint-disable-next-line
              // @ts-ignore
      function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({
            // eslint-disable-next-line
              // @ts-ignore
            id: this.lastID,
            name,
            workload,
            working_time: workingTime,
          })
        }
      },
    )
  })
}

async function createNewRegister({
  userId,
  timeCurrent,
  created_at,
  selectOption,
  day,
  month,
  year,
}) {
  console.log(userId, day)

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFilePath)

    // Check if a record already exists for the given userId, day, month, and year
    db.get(
      `SELECT ${selectOption} FROM registers WHERE user_id = ? AND day = ? AND month = ? AND year = ? AND created_at = ?`,
      [userId, day, month, year, created_at],
      (err, existingRecord) => {
        if (err) {
          reject(err)
        } else {
          if (existingRecord && existingRecord[selectOption] !== null) {
            // If a record exists and the selected option is not null, reject the Promise with an error
            reject({ message: 'O ponto já foi registrado anteriormente.' })
          } else {
            // If no record exists or the selected option is null, perform the insertion or update
            if (existingRecord) {
              // If a record exists but the selected option is null, update the existing record with the new timeCurrent value
              db.run(
                `UPDATE registers SET ${selectOption} = ? WHERE user_id = ? AND day = ? AND month = ? AND year = ?`,
                [timeCurrent, userId, day, month, year],
                function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve({
                      id: this.lastID,
                      userId,
                      timeCurrent,
                      day,
                      month,
                      year,
                      created_at,
                    })
                  }
                },
              )
            } else {
              // If no record exists, insert a new record
              db.run(
                `INSERT INTO registers(user_id, ${selectOption}, day, month, year, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, timeCurrent, day, month, year, created_at],
                function (err) {
                  if (err) {
                    reject(err)
                  } else {
                    resolve({
                      id: this.lastID,
                      userId,
                      timeCurrent,
                      day,
                      month,
                      year,
                      created_at,
                    })
                  }
                },
              )
            }
          }
        }
      },
    )
  })
}

async function updatingTimeUser({selectOption, timeCurrent,userId, day, month, year }) {
  const db = new sqlite3.Database(dbFilePath)

   db.run(
                `UPDATE registers SET ${selectOption} = ? WHERE user_id = ? AND day = ? AND month = ? AND year = ?`,
                [timeCurrent,userId, day, month, year],
                function (err) {
                  if (err) {
                    console.log(err)
                  } else {
                    console.log({
                      id: this.lastID,
                      userId,
                      timeCurrent,
                      day,
                      month,
                      year,
                    })
                  }
                },
              )
}

async function deleteItemFromId(id) {
  const db = new sqlite3.Database(dbFilePath)

  db.run('DELETE FROM users WHERE id=(?)', id, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Successful')
    }
    db.close()
  })
}

module.exports = {
  getAdminFromSQLite,
  getUserFromSQLite,
  getRegistersFromSQLite,
  postDataToSQlite,
  deleteItemFromId,
  updatingTimeUser,
  createNewUser,
  createNewRegister,
}
