export type OptionValue =
  | 'entry'
  | 'lunch_exit'
  | 'lunch_entry'
  | 'extra_exit'
  | 'extra_entry'
  | 'exit'

export type OptionLabel =
  | 'Entrada'
  | 'S. Almoço'
  | 'E. Almoço'
  | 'S. Extra'
  | 'E. Extra'
  | 'Saida'

export interface OptionDate {
  label: OptionLabel
  value: OptionValue
}
export interface OptionData {
  label: string
  value: string
}

export const optionsSelect: OptionDate[] = [
  {
    label: 'Entrada',
    value: 'entry',
  },
  {
    label: 'S. Almoço',
    value: 'lunch_exit',
  },
  {
    label: 'E. Almoço',
    value: 'lunch_entry',
  },
  {
    label: 'S. Extra',
    value: 'extra_exit',
  },
  {
    label: 'E. Extra',
    value: 'extra_entry',
  },
  {
    label: 'Saida',
    value: 'exit',
  },
]

export const optionsMounth: OptionData[] = [
  {
    label: 'Janeiro',
    value: '1',
  },
  {
    label: 'Fevereiro',
    value: '2',
  },
  {
    label: 'Março',
    value: '3',
  },
  {
    label: 'Abril',
    value: '4',
  },
  {
    label: 'Maio',
    value: '5',
  },
  {
    label: 'Julho',
    value: '7',
  },

  {
    label: 'Agosto',
    value: '8',
  },

  {
    label: 'Setembro',
    value: '9',
  },

  {
    label: 'Outubro',
    value: '10',
  },

  {
    label: 'Novembro',
    value: '11',
  },

  {
    label: 'Dezembro',
    value: '12',
  },
]
