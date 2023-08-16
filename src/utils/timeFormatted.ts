export const timeFormatted = (time: Date | undefined) => {
  return (
    time?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }) || '00:00'
  )
}
