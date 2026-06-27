export type Project = {
  id: number
  title: string
  subtitle: string
  details: string
  tags: string[]
  achievement?: string
}

export const computerProjects: Project[] = [
  {
    id: 1,
    title: 'POSN CAMP 1',
    subtitle: 'ค่ายโอลิมปิกวิชาการ สอวน. คอมพิวเตอร์ ค่าย 1',
    details:
      'ค่าย 15 วัน สอนทั้งคณิตศาสตร์และคอมพิวเตอร์ผ่านภาษา C++ เรียนรู้ Algorithm, Data Structure, Sorting, Binary Search เป็นจุดเริ่มต้นของความชอบในการเขียนโค้ดและความอยากเรียนในสายคอมพิวเตอร์ ได้เรียนรู้ความผิดพลาดจากการไม่ได้เตรียมตัว ทำให้ค้นพบตัวเองว่าชื่นชอบการเขียนโปรแกรม',
    tags: ['C++', 'Algorithm', 'Data Structure'],
  },
  {
    id: 2,
    title: 'CU TOWN',
    subtitle: 'Thailand Metaverse Hackathon',
    details:
      'โปรเจกต์ Metaverse สำหรับอ่านหนังสือออนไลน์กับเพื่อน แก้ปัญหา "ไม่อยากอ่านหนังสือคนเดียว" ออกแบบเป็นเกมแบบ Metaverse ให้ทุกคนมาใช้ชีวิตร่วมกัน รวมคนที่มีเป้าหมายเดียวกันเข้ามา ทำหน้าที่เป็นหัวหน้าโครงการ ทำ Prototype ใช้ AI ช่วยพัฒนา',
    tags: ['Metaverse', 'Prototype', 'AI'],
    achievement: 'เข้ารอบรองชนะเลิศระดับประเทศ',
  },
  {
    id: 3,
    title: 'Heal The Horror',
    subtitle: 'INTELLIGENCE CAMP BY HAMSTERHUB',
    details:
      'ค่ายสร้าง Game Project ภายใน 3 วัน วันแรก — สร้างแมพแนว Horror ได้ที่ 1 หัวข้อสร้างแมพ เรียนรู้การใช้ Asset และจัดแสง วันที่สอง — เริ่มใช้ AI ช่วยสร้างโค้ด การเดินของ Player และผี ผ่าน Antigravity วันที่สาม — สร้าง Timeline, สกิลของ Player, UX/UI ได้ที่ 1 หัวข้อไทม์ไลน์ยอดเยี่ยม',
    tags: ['Unity', 'Antigravity', 'AI', 'Timeline'],
    achievement: 'ชนะเลิศเกมยอดเยี่ยมของค่าย',
  },
  {
    id: 4,
    title: 'การออกแบบสิ่งของเครื่องใช้',
    subtitle: 'ศิลปหัตถกรรม ครั้งที่ 71',
    details:
      'ได้เข้าค่ายภายในโรงเรียนด้านการปั้นโมเดล จนพี่ในค่ายเลือกมาเป็นตัวแทนโรงเรียนแข่งรายการปั้นโมเดล 3D ด้วยโปรแกรมคอมพิวเตอร์ ทีมเลือกใช้โปรแกรม Blender ในการทำโมเดล',
    tags: ['Blender', '3D Modeling'],
    achievement: 'รางวัลรองชนะเลิศ',
  },
]

export const scimathProjects: Project[] = [
  {
    id: 1,
    title: 'จรวดขวดน้ำระดับประเทศ ครั้งที่ 22',
    subtitle: 'ตัวแทนโรงเรียน',
    details:
      'หลังจากได้รางวัลชนะเลิศจรวดขวดน้ำของโรงเรียน ได้รับคัดเลือกเข้าทีมตัวแทนโรงเรียน ฝึกซ้อมอย่างหนักช่วงปิดเทอม การแข่งขันนี้ทำให้ค้นพบว่าอยากเรียนในสายวิศวกรรม เพราะชอบการประดิษฐ์และทดลอง',
    tags: ['Physics', 'Engineering'],
  },
  {
    id: 2,
    title: 'จรวดขวดน้ำ วันวิทยาศาสตร์',
    subtitle: 'โรงเรียนสวนกุหลาบวิทยาลัย รังสิต',
    details:
      'เข้าร่วมแข่งขันจรวดขวดน้ำภายในโรงเรียนเนื่องในโอกาสวันวิทยาศาสตร์ ทีมได้รับรางวัลชนะเลิศ ทำให้ได้รับโอกาสจากอาจารย์ให้เข้ามาเป็นส่วนหนึ่งของทีม',
    tags: ['Science', 'Teamwork'],
    achievement: 'รางวัลชนะเลิศ',
  },
  {
    id: 3,
    title: 'Kasetsart Water Rocket 2023',
    subtitle: 'ม.เกษตรศาสตร์',
    details:
      'ได้รับโอกาสจากอาจารย์ที่ดูแลชุมนุมให้ทีมเข้าร่วมแข่งขันของ ม.เกษตรศาสตร์ เป็นตัวแทนของโรงเรียนสวนกุหลาบวิทยาลัย รังสิต',
    tags: ['Competition', 'University'],
  },
  {
    id: 4,
    title: 'Staff SKR Openhouse',
    subtitle: 'Water Rocket',
    details:
      'หลังเลิกแข่ง อาจารย์ติดต่อให้ช่วยจัดงานแข่งขันจรวดขวดน้ำภายในโรงเรียน ได้รับตำแหน่งเป็นพี่สาธิตการใช้งานและคนคอยคุมงาน',
    tags: ['Leadership', 'Mentoring'],
  },
  {
    id: 5,
    title: 'K-Engineering World Tour 2025',
    subtitle: 'Workshop',
    details:
      'เข้าร่วมกิจกรรม K-Engineer World Tour and Workshop 2025 ทั้ง 2 วัน เพื่อเรียนรู้การเรียนภายในคณะวิศวกรรมแต่ละสาขา สนใจสาขาคอมพิวเตอร์, AI, IoT',
    tags: ['Workshop', 'IoT', 'AI'],
  },
]

export const otherCamps: Project[] = [
  {
    id: 1,
    title: 'JUBCHAI Camp',
    subtitle: 'ค่ายคอมพิวเตอร์ค่ายแรก',
    details:
      'ค่ายที่มีผลอย่างมากต่อชีวิต ทำให้สนใจเรื่องคอม ได้รู้จักอาจารย์หมวดคอมพิวเตอร์และรุ่นพี่หลายคน ทำให้ได้มีโอกาสไปแข่งต่อในงานศิลปหัตถกรรมและได้รางวัลรองชนะเลิศ เป็นจุดเริ่มต้นสำคัญที่ทำให้อยากเรียนต่อในสายคอมพิวเตอร์',
    tags: ['Inspiration', 'Networking'],
  },
]

export const skills = [
  'Unity', 'Blender', 'C++', 'HTML', 'AI-assisted Dev',
  'UX/UI', 'Timeline System', 'Game Mechanics', 'Prototype', '3D Modeling',
]

export const navItems = [
  { id: 'main', label: 'Main' },
  { id: 'computer', label: 'Computer Projects' },
  { id: 'scimath', label: 'Sci-Math' },
  { id: 'camp', label: 'Camp & Other' },
  { id: 'built', label: 'Built' },
]

export const projectCategories: Record<string, Project[]> = {
  computer: computerProjects,
  scimath: scimathProjects,
  camp: otherCamps,
}
