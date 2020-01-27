import {IDepartment} from "../interfaces/IDepartment"

export default class MasterDao {
  public static departmentList(): IDepartment[] {
    return [
      { id: 1, name: 'NBX OS事業部' },
      { id: 2, name: 'NBX UI/UX室' },
      { id: 3, name: 'NBX 開発室' },
      { id: 4, name: 'NBX クリエイティブ室' },
      { id: 5, name: 'NBX 経営企画室' },
      { id: 9, name: 'その他', withText: true }
    ]
  }
  public static department(id: number): IDepartment | null {
    const list = MasterDao.departmentList()
    for (const obj of list) {
      if (obj.id === id) {
        return obj
      }
    }
    return null
  }
}
