export default class UtilDate {
  public static format(date: Date, format: string): string {
    if (!date) {
      return ''
    }

    // date = new Date(date);

    let ret = format
    if (format.includes('Y')) {
      ret = ret.replace(/Y/, date.getFullYear().toString())
    }
    if (format.includes('m')) {
      ret = ret.replace(
        /m/,
        UtilDate.zeroPadding((date.getMonth() + 1).toString(), 2)
      )
    }
    if (format.includes('n')) {
      ret = ret.replace(/n/, (date.getMonth() + 1).toString())
    }
    if (format.includes('d')) {
      ret = ret.replace(/d/, UtilDate.zeroPadding(date.getDate().toString(), 2))
    }
    if (format.includes('j')) {
      ret = ret.replace(/j/, date.getDate().toString())
    }
    if (format.includes('H')) {
      ret = ret.replace(
        /H/,
        UtilDate.zeroPadding(date.getHours().toString(), 2)
      )
    }
    if (format.includes('i')) {
      ret = ret.replace(
        /i/,
        UtilDate.zeroPadding(date.getMinutes().toString(), 2)
      )
    }
    if (format.includes('s')) {
      ret = ret.replace(
        /s/,
        UtilDate.zeroPadding(date.getSeconds().toString(), 2)
      )
    }
    return ret
  }

  public static parse(str: string): Date {
    const tmp: any[] = str.split('-')
    if (tmp.length === 3) {
      const ret = new Date()
      ret.setFullYear(tmp[0])
      ret.setMonth(tmp[1] - 1)
      ret.setDate(tmp[2])
      ret.setHours(0)
      ret.setMinutes(0)
      ret.setSeconds(0)

      return ret
    }
    throw new Error('cannot parse to date ' + str)
  }
  public static parseFirebase(tm: any): Date | null {
    if (!tm) {
      return null
    }
    return new Date(tm.seconds * 1000)
  }

  public static getAge(birthday: Date) {
    const today = new Date()

    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthday.getMonth(),
      birthday.getDate()
    )

    const age: number = today.getFullYear() - birthday.getFullYear()
    if (today < thisYearBirthday) {
      return age - 1
    } else {
      return age
    }
  }

  private static zeroPadding(num: string, len: number) {
    for (let i = 0; i < len - 1; i++) {
      num = '0' + num
    }
    return num.slice(-len)
  }
}
