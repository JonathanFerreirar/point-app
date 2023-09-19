/* eslint-disable */
// @ts-nocheck
import ExcelJS from 'exceljs'
import { footerStyle, headerStyle, headerTitleStyle } from './styles'
import { Employee } from '@/components/Modal/modal'
import * as f from '../../src/functions/functionsHours'
import { IUserDays } from '@/pages/employees/Employees'

interface Data extends Employee {
  id: number
}

export async function createExcelFileAllBeforeDay(
  filename: string,
  data: IUserDays[],
) {
  // create a new workbook and sheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('PONTO DIARIO')

  // Main title of the table
  const headerTile = [['PONTO DIARIO']]
  worksheet.addRows(headerTile)

  worksheet.mergeCells('A1:J1')

  //const getUser = (id: string) => employees.find(value => value?.id == id)

  // Style Title
  const headerTitleRow = worksheet.getRow(1)
  headerTitleRow.alignment = { horizontal: 'center' }
  headerTitleRow.eachCell(headerTitleCell => {
    headerTitleCell.fill = headerTitleStyle.fill
    headerTitleCell.font = headerTitleStyle.font
    headerTitleCell.border = headerTitleStyle.border
  })

  // Add and style table headers
  const headers = [
    [
      'DATA',
      'NOME',
      'ENTRADA',
      'S. ALMOÇO',
      'E. ALMOÇO',
      'S. EXTRA',
      'E. EXTRA',
      'SAIDA',
      'RESULTADO',
    ],
  ]

  worksheet.addRows(headers)

  const headerRow = worksheet.getRow(2)
  headerRow.alignment = { horizontal: 'center' }
  headerRow.eachCell(headerCell => {
    headerCell.fill = headerStyle.fill
    headerCell.font = headerStyle.font
    headerCell.border = headerStyle.border
  })

  worksheet.columns.forEach(colum => {
    colum.width = 9
  })

  // TODO: Registers Logic..

  data.forEach(userDay => {
    const hour = f.resultTime({
      entry: f.handleHourToMinut(userDay.entry),
      exitToLunch: f.handleHourToMinut(userDay.lunch_exit),
      entryFromLunch: f.handleHourToMinut(userDay.lunch_entry),
      exitExtraTime: f.handleHourToMinut(userDay.extra_exit),
      entryExtraTime: f.handleHourToMinut(userDay.extra_entry),
      exit: f.handleHourToMinut(userDay.exit),
    })

    const result = f.handleMinutoToHour(hour)
    const bankTime = f.bankTime({
      timeWork: f.handleHourToMinut(result),
      timeAtWork: f.handleHourToMinut(userDay.year),
    })
    const end = f.handleMinutoToBank(bankTime)
    //bank.push(resultBankTime)
    worksheet.addRows([
      [
        userDay.created_at,
        userDay.day,
        userDay.entry || '00:00',
        userDay.lunch_exit || '00:00',
        userDay.lunch_entry || '00:00',
        userDay.extra_exit || '00:00',
        userDay.extra_entry || '00:00',
        userDay.exit || '00:00',
        end || '00:00',
      ],
    ])
  })

  // Table footer

  /*
  const footer = ['Total de horas']
  worksheet.addRow(footer)

  const footerRow = worksheet.lastRow!
  footerRow.alignment = { horizontal: 'center' }
  footerRow.font = footerStyle.font

  const footerCellMerge =
    footerRow.getCell(1).$col$row +
    ':' +
    footerRow.getCell(headerRow.cellCount - 1).$col$row

  worksheet.mergeCells(footerCellMerge)

  // Result of calculating the total overtime hours
  const getTotalHour = () => {
    let soma = 0
    bank.forEach(item => {
      soma += handleHourToMinut(item)
    })
    return handleMinutoToBank(soma)
  }

  footerRow.getCell(headerRow.cellCount).value = getTotalHour()
  footerRow.eachCell(cell => {
    cell.border = footerStyle.border
  })
*/
  await workbook.xlsx.writeFile(filename)
}
