/* eslint-disable */
// @ts-nocheck
import ExcelJS from 'exceljs'
import { footerStyle, headerStyle, headerTitleStyle } from './styles'
import { Employee } from '@/components/Modal/modal'
import {
  resultTime,
  handleHourToMinut,
  bankTime,
  handleMinutoToBank,
  handleMinutoToHour,
} from '../../src/functions/functionsHours'

interface Data extends Employee {
  id: number
}


export async function createExcelFile(filename: string, data: Data) {
  const bank = []
  // create a new workbook and sheet
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(data.name.toUpperCase())

  // Main title of the table
  const headerTile = [[data.name.toUpperCase()]]
  worksheet.addRows(headerTile)

  worksheet.mergeCells('A1:J1')

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
      'ENTRADA',
      'SAIDA ALMOÇO',
      'ENTRADA ALMOÇO',
      'SAIDA EXTRA',
      'ENTRADA EXTRA',
      'SAIDA',
      'QNT HORAS TRAB.',
      'HORAS Á TRAB.',
      'BANCO DE HORAS',
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
    colum.width = 18
  })

  // TODO: Registers Logic..

  data.registered.forEach(register => {
    const hour = resultTime({
      entry: handleHourToMinut(register.entry),
      exitToLunch: handleHourToMinut(register.lunch_exit),
      entryFromLunch: handleHourToMinut(register.lunch_entry),
      exitExtraTime: handleHourToMinut(register.extra_exit),
      entryExtraTime: handleHourToMinut(register.extra_entry),
      exit: handleHourToMinut(register.exit),
    })

    const result = handleMinutoToHour(hour)
    const TimeBank = bankTime({
      timeWork: handleHourToMinut(result),
      timeAtWork: handleHourToMinut(data.working_time),
    })
    const resultBankTime = handleMinutoToBank(TimeBank)
    bank.push(resultBankTime)
    worksheet.addRows([
      [
        register.created_at,
        register.entry || '00:00',
        register.lunch_exit || '00:00',
        register.lunch_entry || '00:00',
        register.extra_exit || '00:00',
        register.extra_entry || '00:00',
        register.exit || '00:00',
        result || '00:00',
        data.working_time,
        resultBankTime || '00:00',
      ],
    ])
  })

  // Table footer
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

  await workbook.xlsx.writeFile(filename)
}
