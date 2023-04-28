import moment from 'moment'

export const pickerOptions = {
  shortcuts: [{
    text: 'Last week',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Last month',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: 'Last 3 months',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}

export const init7Days = () => {
  const formatedDate = 'DD-MM-YYYY'
  const initStartDate = moment().subtract(7, 'days').format(formatedDate)
  const initEndDate = moment().format(formatedDate)

  return [initStartDate, initEndDate]
}
