interface TimeObject {
  entry: number
  exitToLunch: number
  entryFromLunch: number
  exitExtraTime: number
  entryExtraTime: number
  exit: number
}

/**
 *
 * @param time string
 * @returns number
 * @example
 *
 *  const hours = [
    {
      entry: '09:00',
      exitToLunch: '12:00',

    },
  ]
 *   hours.map(value => {
      const entry = handleHourToMinut(value.entrada)
      const exitToLunch = handleHourToMinut(value.saidaA)

      console.log(entry)  - 540  It value is respective hour in minuts

      console.log(exitToLunch) - 720 It value is the respective hour in minuts

      ...


 */
export const handleHourToMinut = (time?: string) => {
  if (!time) return 0
  const newTime = time.replace(':', '.')

  const floatValue = parseFloat(newTime)
  const intValue = parseInt(newTime)

  const hoursInMinuts = intValue * 60

  const restMinuts = Math.round((floatValue % 1) * 100)

  const result = hoursInMinuts + restMinuts

  return result
}

/**
 *
 * @param param0 TimeObject
 * @returns Number
 * @example
 *
 * Normally used in conjunction with the handleHourToMinut Function
 *
 * *  const hours = [
    {
      entry: handleHourToMinut('08:15'),
      exitToLunch: handleHourToMinut('12:00'),
      entryFromLunch: handleHourToMinut('12:59'),
      exitExtraTime: handleHourToMinut('14:00'),
      entryExtraTime: handleHourToMinut('15:00'),
      exit: handleHourToMinut('18:53'),
    },
  ]
 *   hours.map(value => {
      const entry = handleHourToMinut(value.entrada)
      const exitToLunch = handleHourToMinut(value.saidaA)
      const entryFromLunch = handleHourToMinut(value.saidaE)
      const exitExtraTime = handleHourToMinut(value.extraA)
      const entryExtraTime = handleHourToMinut(value.extraE)
      const exit = handleHourToMinut(value.exit)


 * const sumOfTheTimeInMinuts = resultTime({
        entry,
        exitToLunch,
        entryFromLunch,
        exitExtraTime,
        entryExtraTime,
        exit,

      })

      console.log(sumOfTheTimeInMinuts)  Output: 1133

      The output is the time in minuts

      ...
 */
export const resultTime = ({
  entry,
  exitToLunch,
  entryFromLunch,
  exitExtraTime,
  entryExtraTime,
  exit,
}: TimeObject) => {
  const firstTime = exitToLunch - entry
  const secondTime = exitExtraTime - entryFromLunch
  const thirtTime = exit - entryExtraTime
  const endResult = firstTime + secondTime + thirtTime
  return endResult
}

interface bankTime {
  timeWork: number
  timeAtWork: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const bankTime = ({ timeWork, timeAtWork }: bankTime) => {
  //let endResult
  // if (timeWork > timeAtWork) {
  //   endResult = timeWork - timeAtWork
  // } else {
  //   endResult = timeAtWork - timeWork
  // }
  const endResult = timeWork - timeAtWork

  return endResult
}

export const handleMinutoToBank = (hora: number) => {
  let MinutsToHour
  if (Math.floor(hora / 60) < 10) {
    MinutsToHour = Math.floor(hora / 60)
  } else {
    MinutsToHour = Math.floor(hora / 60)
  }

  let RestMinuts
  //&& hora % 60 >= 0
  if (hora % 60 < 10 && hora % 60 >= -9) {
    RestMinuts = '0' + (hora % 60)
    console.log({ RestMinuts })
  } else {
    RestMinuts = hora % 60
  }
  const regex = /[.-]/g
  let result = String(MinutsToHour + ':' + RestMinuts).replaceAll(regex, '')
  if (hora < 0) {
    result = String(MinutsToHour + 1 + ':' + RestMinuts).replaceAll(regex, '')
    return '-' + result
  }

  return result
}

/**
 *
 * @param hora number
 * @returns string
 * @example
 *
 * Normally used in conjunction with the resultTime that is used conjuntions with handleHoursToMinut
 *
 *   const sumOfTheTimeInMinuts = resultTime({
        entry,
        exitToLunch,
        entryFromLunch,
        exitExtraTime,
        entryExtraTime,
        exit,
      })

      const TransformMinuteToStringHour = handleMinutoToHour(endResult)

      ...

 */

export const handleMinutoToHour = (hora: number) => {
  let MinutsToHour
  if (Math.floor(hora / 60) < 10 && hora % 60 >= 0) {
    MinutsToHour = '0' + Math.floor(hora / 60)
  } else {
    MinutsToHour = Math.floor(hora / 60)
  }

  let RestMinuts
  if (hora % 60 < 10 && hora % 60 >= 0) {
    RestMinuts = '0' + (hora % 60)
  } else {
    RestMinuts = hora % 60
  }

  const result = String(MinutsToHour + ':' + RestMinuts)

  const regex = /[.-]/g
  return result.replaceAll(regex, '')
}
