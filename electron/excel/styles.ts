import { Borders, Fill, Font } from 'exceljs'

interface HeaderStyle {
  font: Partial<Font>
  border: Partial<Borders>
  fill: Fill
}

interface HeaderTitleStyle {
  font: Partial<Font>
  border: Partial<Borders>
  fill: Fill
}

interface FooterStyle {
  font: Partial<Font>
  border: Partial<Borders>
}

export const headerStyle: HeaderStyle = {
  font: {
    bold: true,
    size: 6,
    name: 'Arial',
  },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF' },
  },
  border: {
    right: { style: 'thin' },
    bottom: { style: 'thin' },
  },
}

export const headerTitleStyle: HeaderTitleStyle = {
  font: {
    color: { argb: 'FFFFFF' },
    bold: true,
    name: 'Arial',
    size: 7,
  },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '093D9' },
  },
  border: {
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
}

export const footerStyle: FooterStyle = {
  font: {
    bold: true,
    size: 7,
    name: 'Arial',
  },
  border: {
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
}
