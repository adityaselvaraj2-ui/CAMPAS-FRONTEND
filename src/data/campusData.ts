export type BuildingCategory = 'academic' | 'residential' | 'facility' | 'recreation';

export interface Building {
  id: string;
  name: string;
  icon: string;
  lat: number;
  lng: number;
  category: BuildingCategory;
  description: string;
  floors?: number;
  capacity?: number;
  schedule?: BuildingSchedule;
}

export interface BuildingSchedule {
  type?: 'standard' | 'multi-session' | 'hostel';
  weekday?: { open: string; close: string };
  saturday?: { open: string; close?: string };
  sunday?: { open: string; close?: string };
  alldays?: Record<string, { open: string; close: string }>;
}

export interface Campus {
  id: string;
  name: string;
  shortName: string;
  center: [number, number];
  color: string;
  colorVar: string;
  buildings: Building[];
}

const sjceBuildings: Building[] = [
  { id: 'sjce-main-entrance', name: 'SJCE Main Entrance', icon: '🚪', lat: 12.8702216, lng: 80.2263868, category: 'facility', description: 'Primary entrance gate to SJCE off OMR Road, Chennai.', floors: 1, capacity: 50 },
  { id: 'sjce-cse-block', name: 'CSE Block (Block 1)', icon: '💻', lat: 12.8689675, lng: 80.2163948, category: 'academic', description: 'Computer Science & Engineering department — AI, ML, cloud computing and programming labs.', floors: 4, capacity: 600 },
  { id: 'sjce-it-block', name: 'IT Block (Block 2)', icon: '🖥️', lat: 12.8689466, lng: 80.2160568, category: 'academic', description: 'Information Technology department with networking, cybersecurity and DevOps labs.', floors: 4, capacity: 500 },
  { id: 'sjce-block3', name: 'Block 3', icon: '🏢', lat: 12.8690303, lng: 80.2157832, category: 'academic', description: 'Academic block — department classrooms and faculty rooms.', floors: 3, capacity: 400 },
  { id: 'sjce-block4', name: 'Block 4', icon: '🏢', lat: 12.8690564, lng: 80.2154775, category: 'academic', description: 'Academic block — department classrooms and faculty rooms.', floors: 3, capacity: 400 },
  { id: 'sjce-block5', name: 'Block 5', icon: '🏢', lat: 12.8691976, lng: 80.2151931, category: 'academic', description: 'Academic block — department classrooms and seminar rooms.', floors: 3, capacity: 400 },
  { id: 'sjce-eg-drawing', name: 'EG Drawing Hall', icon: '📐', lat: 12.8689675, lng: 80.2148606, category: 'academic', description: 'Engineering Graphics drawing hall for first-year students across all departments.', floors: 1, capacity: 300 },
  { id: 'sjce-library', name: 'Library', icon: '📚', lat: 12.8697990, lng: 80.2149357, category: 'academic', description: 'Central library with 50,000+ volumes, digital access, and reading halls.', floors: 3, capacity: 500, schedule: { weekday: { open: '08:00', close: '20:00' }, saturday: { open: '09:00', close: '17:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'sjce-block7', name: 'Block 7 — Innovation Centre', icon: '💡', lat: 12.8700489, lng: 80.2170983, category: 'academic', description: 'Innovation & entrepreneurship centre — startup incubation, ideation labs, and prototyping tools.', floors: 3, capacity: 200 },
  { id: 'sjce-block9', name: 'Block 9 — Mech (2–4 Year)', icon: '⚙️', lat: 12.8701038, lng: 80.2168891, category: 'academic', description: 'Mechanical Engineering block for 2nd to 4th year students.', floors: 3, capacity: 350 },
  { id: 'sjce-block10', name: 'Block 10 — Mech Lab', icon: '🔧', lat: 12.8701369, lng: 80.2166825, category: 'academic', description: 'Mechanical Engineering laboratory — thermal, fluid dynamics, and CAD/CAM.', floors: 2, capacity: 200 },
  { id: 'sjce-block11', name: 'Block 11 — CSE Lab (1st Year)', icon: '🖱️', lat: 12.8701709, lng: 80.2164572, category: 'academic', description: 'First-year Computer Science lab for C programming, data structures, and OS fundamentals.', floors: 2, capacity: 250 },
  { id: 'sjce-block12', name: 'Block 12', icon: '🏛️', lat: 12.8686896, lng: 80.2167442, category: 'academic', description: 'Academic block — classrooms and faculty offices.', floors: 3, capacity: 300 },
  { id: 'sjce-block-chem-phy', name: 'Chemistry & Physics Block', icon: '⚗️', lat: 12.8702363, lng: 80.2162031, category: 'academic', description: 'Basic Sciences block — Chemistry and Physics theory classes and labs for all first-years.', floors: 3, capacity: 300 },
  { id: 'sjce-block13', name: 'Block 13', icon: '🏢', lat: 12.8703069, lng: 80.2160127, category: 'academic', description: 'Academic block — classrooms and seminar halls.', floors: 3, capacity: 300 },
  { id: 'sjce-admin-lib', name: 'SJCE Admin & Library Hub', icon: '🏛️', lat: 12.8693150, lng: 80.2169603, category: 'facility', description: 'Admin offices, library annexe, and student clubs coordination hub.', floors: 3, capacity: 200, schedule: { weekday: { open: '09:00', close: '17:00' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'sjce-hackathon', name: 'Hackathon Centre', icon: '🚀', lat: 12.8695866, lng: 80.2169871, category: 'academic', description: '24/7 hackathon and competitive programming arena — open to all students.', floors: 1, capacity: 100 },
  { id: 'sjce-auditorium', name: 'SJCE Auditorium', icon: '🎭', lat: 12.8684333, lng: 80.2159932, category: 'academic', description: 'Main auditorium for convocations, symposia, and cultural events.', floors: 2, capacity: 800 },
  { id: 'sjce-outdoor-theatre', name: 'Outdoor Theatre', icon: '🎪', lat: 12.8685275, lng: 80.2153656, category: 'recreation', description: 'Open-air amphitheatre for cultural performances and outdoor events.', floors: 0, capacity: 500 },
  { id: 'sjce-exam-block', name: 'Exam Block', icon: '📝', lat: 12.8708374, lng: 80.2163320, category: 'facility', description: 'Dedicated examination block with large halls for university exams.', floors: 2, capacity: 600 },
  { id: 'sjce-mba-block', name: 'MBA Block', icon: '📊', lat: 12.8704063, lng: 80.2151715, category: 'academic', description: 'Management Studies (MBA) department — classrooms, case-study rooms, and conference halls.', floors: 3, capacity: 250 },
  { id: 'sjce-placement-block', name: 'Placement Block', icon: '💼', lat: 12.8709529, lng: 80.2170067, category: 'facility', description: 'Training & placement office — aptitude coaching, mock interviews, and HR coordination.', floors: 2, capacity: 120, schedule: { weekday: { open: '09:00', close: '17:00' }, saturday: { open: 'CLOSED' }, sunday: { open: 'CLOSED' } } },
  { id: 'sjce-mgr-statue', name: 'MGR Statue', icon: '🗿', lat: 12.8695071, lng: 80.2159081, category: 'facility', description: 'Landmark statue of M.G. Ramachandran at the campus junction — popular meeting point.', floors: 0, capacity: 50 },
  { id: 'sjce-indian-bank', name: 'Indian Bank', icon: '🏦', lat: 12.8685379, lng: 80.2151617, category: 'facility', description: 'Indian Bank branch with ATM on campus for students and staff.', floors: 1, capacity: 20, schedule: { weekday: { open: '09:30', close: '15:30' }, saturday: { open: '09:30', close: '12:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'sjce-xerox-shop', name: 'Xerox Shop (Boys Side)', icon: '🖨️', lat: 12.8701754, lng: 80.2154548, category: 'facility', description: 'Stationery, photocopy, and printing shop near the boys hostel block.', floors: 1, capacity: 15, schedule: { weekday: { open: '08:00', close: '20:00' }, saturday: { open: '08:00', close: '18:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'sjce-mega-kitchen', name: 'SJCE Mega Kitchen', icon: '🍳', lat: 12.8683601, lng: 80.2145663, category: 'facility', description: 'Large central kitchen serving the hostel mess and campus canteen.', floors: 1, capacity: 50, schedule: { weekday: { open: '05:30', close: '21:00' }, saturday: { open: '05:30', close: '21:00' }, sunday: { open: '05:30', close: '21:00' } } },
  { id: 'sjce-boys-mess', name: 'SJCE Boys Mess', icon: '🍽️', lat: 12.8682503, lng: 80.2150598, category: 'facility', description: 'Hostel mess serving breakfast, lunch, and dinner for boys hostel residents.', floors: 1, capacity: 400, schedule: { type: 'hostel', alldays: { gate: { open: '06:00', close: '22:00' } } } },
  { id: 'sjce-boys-old-hostel', name: 'Boys Old Hostel', icon: '🏨', lat: 12.8669743, lng: 80.2151081, category: 'residential', description: 'Original boys hostel block — older building with established community.', floors: 4, capacity: 300, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'sjce-new-hostel', name: 'SJCE New Hostel', icon: '🏢', lat: 12.8666325, lng: 80.2164258, category: 'residential', description: 'Newly constructed hostel block with modern facilities and Wi-Fi connectivity.', floors: 5, capacity: 400, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'sjce-bus-bay', name: 'SJCE Bus Bay', icon: '🚌', lat: 12.8714226, lng: 80.2163512, category: 'facility', description: 'Campus bus terminal — MTC and college bus pickup/drop for students and staff.', floors: 0, capacity: 200 },
  { id: 'sjce-football-ground', name: 'SJCE Football Ground', icon: '⚽', lat: 12.8671207, lng: 80.2136704, category: 'recreation', description: 'Full-size football ground used for inter-department and inter-college tournaments.', floors: 0, capacity: 500 },
  { id: 'sjce-stadium', name: 'SJCE Stadium', icon: '🏟️', lat: 12.8651594, lng: 80.2164033, category: 'recreation', description: 'Main athletics stadium — cricket ground, running track, and outdoor sports complex.', floors: 0, capacity: 1500 },
];

const sjitBuildings: Building[] = [
  { id: 'sjit-class-block-1', name: 'SJIT Class Block 1 (2–4 Year)', icon: '🏛️', lat: 12.8698814, lng: 80.2186308, category: 'academic', description: 'Main teaching block for 2nd to 4th year students across all departments.', floors: 4, capacity: 700 },
  { id: 'sjit-sports-gnd', name: 'Sports Ground', icon: '⚽', lat: 12.8695153, lng: 80.2185718, category: 'recreation', description: 'Multi-sport open ground — cricket, football, volleyball, and athletics.', floors: 0, capacity: 600 },
  { id: 'sjit-aud-exam', name: 'Auditorium & Exam Hall', icon: '🎓', lat: 12.8690846, lng: 80.2184474, category: 'academic', description: 'Combined auditorium and examination hall — seminars, convocations, and university exams.', floors: 2, capacity: 800 },
  { id: 'sjit-admin-lib', name: 'Admin / Library / AV / Conference / Placement', icon: '🏢', lat: 12.8694083, lng: 80.2195628, category: 'facility', description: 'Central hub: Admin offices, library, AV rooms, conference halls, placement panel, and principal\'s chamber.', floors: 4, capacity: 400, schedule: { weekday: { open: '09:00', close: '17:30' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'sjit-1st-year-block', name: '1st Year Block (All Depts)', icon: '🎒', lat: 12.8695206, lng: 80.2205275, category: 'academic', description: 'First-year teaching block — Mech/CSE labs, Drawing Hall (×4) for all incoming students.', floors: 4, capacity: 600 },
  { id: 'sjit-lab-block', name: 'Lab Block (ECE / EEE / IT / ADS)', icon: '🔬', lat: 12.8691127, lng: 80.2206026, category: 'academic', description: 'Multi-department lab block — ECE, ADS, EEE, and IT laboratories.', floors: 3, capacity: 400 },
  { id: 'sjit-boys-hostel', name: 'Boys Hostel', icon: '🏨', lat: 12.8688521, lng: 80.2197519, category: 'residential', description: 'Male student residential block with mess, Wi-Fi, and common room.', floors: 4, capacity: 500, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'sjit-girls-hostel', name: 'Girls Hostel', icon: '🏩', lat: 12.8685035, lng: 80.2181067, category: 'residential', description: 'Female student residential block with 24/7 CCTV and warden supervision.', floors: 4, capacity: 400, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '20:30' } } } },
  { id: 'sjit-bus-bay', name: 'SJIT Bus Bay', icon: '🚌', lat: 12.8680393, lng: 80.2193067, category: 'facility', description: 'College and MTC bus pickup/drop zone for SJIT students and staff.', floors: 0, capacity: 100 },
  { id: 'sjit-football-ground', name: 'Football Ground', icon: '🏃', lat: 12.8672460, lng: 80.2178835, category: 'recreation', description: 'Football and outdoor sports ground at the southern end of SJIT campus.', floors: 0, capacity: 300 },
  { id: 'sjit-car-parking', name: 'Car Parking', icon: '🅿️', lat: 12.8702500, lng: 80.2177286, category: 'facility', description: 'Designated car and two-wheeler parking area for staff and visitors.', floors: 0, capacity: 150 },
  { id: 'sjit-temples', name: 'Temples', icon: '🛕', lat: 12.8697479, lng: 80.2176589, category: 'facility', description: 'Campus spiritual area — Vinayagar and other deity shrines for students and staff.', floors: 1, capacity: 80 },
];

const citBuildings: Building[] = [
  { id: 'cit-main-entrance', name: 'CIT Main Entrance', icon: '🚪', lat: 11.0290796, lng: 77.0263903, category: 'facility', description: 'Primary entrance gate to Coimbatore Institute of Technology off Avinashi Road.', floors: 1, capacity: 50 },
  { id: 'cit-security', name: 'Security Checkpoint', icon: '🛡️', lat: 11.0290520, lng: 77.0264896, category: 'facility', description: 'Main security post with visitor registration and vehicle inspection.', floors: 1, capacity: 10 },
  { id: 'cit-polytechnic-entry', name: 'Polytechnic Entrance', icon: '🚧', lat: 11.0299778, lng: 77.0276950, category: 'facility', description: 'Separate entrance gate for CIT Sandwich Polytechnic College.', floors: 1, capacity: 20 },
  { id: 'cit-main-building', name: 'CIT Main Building', icon: '🏛️', lat: 11.0284993, lng: 77.0267968, category: 'academic', description: 'Iconic red-brick main building — principal\'s office, admin, and senior departments.', floors: 4, capacity: 600, schedule: { weekday: { open: '08:00', close: '17:30' }, saturday: { open: '08:00', close: '13:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-it-block', name: 'CIT IT Block', icon: '💻', lat: 11.0276315, lng: 77.0264132, category: 'academic', description: 'IT dept — floors 2–4 labs; Ground: Mechatronics Lab; CEO office for exams.', floors: 4, capacity: 500 },
  { id: 'cit-library', name: 'CIT Library Block', icon: '📚', lat: 11.0276254, lng: 77.0269745, category: 'academic', description: 'Central library with 60,000+ volumes, DELNET digital access, and reading halls.', floors: 3, capacity: 450, schedule: { weekday: { open: '08:00', close: '20:00' }, saturday: { open: '09:00', close: '17:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-mse-block', name: 'MSE Block', icon: '⚙️', lat: 11.0277349, lng: 77.0278787, category: 'academic', description: 'Materials Science & Engineering department block.', floors: 3, capacity: 300 },
  { id: 'cit-labs', name: 'Labs Block (1–4 Year / MAX Lab)', icon: '🔬', lat: 11.0273268, lng: 77.0270552, category: 'academic', description: 'Multi-year engineering laboratory complex — MAX Lab and all department labs.', floors: 4, capacity: 400 },
  { id: 'cit-civil-lab', name: 'Civil Lab', icon: '🏗️', lat: 11.0275517, lng: 77.0259863, category: 'academic', description: 'Civil Engineering lab — structural testing, concrete, and surveying equipment.', floors: 2, capacity: 150 },
  { id: 'cit-old-buildings', name: 'Old Buildings', icon: '🏚️', lat: 11.0280772, lng: 77.0260276, category: 'academic', description: 'Original heritage campus buildings — additional classrooms and faculty rooms.', floors: 2, capacity: 200 },
  { id: 'cit-polytechnic', name: 'CIT Sandwich Polytechnic College', icon: '🎓', lat: 11.0279120, lng: 77.0287781, category: 'academic', description: 'Affiliated polytechnic college offering diploma programmes in engineering.', floors: 3, capacity: 400 },
  { id: 'cit-workshop', name: 'CIT Workshop', icon: '🔧', lat: 11.0281858, lng: 77.0291912, category: 'academic', description: 'Central engineering workshop — fabrication, welding, fitting, manufacturing.', floors: 1, capacity: 200 },
  { id: 'cit-auditorium', name: 'CIT Auditorium', icon: '🎭', lat: 11.0286976, lng: 77.0272285, category: 'academic', description: 'Main auditorium — convocations, cultural fests, seminars, and inter-college events.', floors: 2, capacity: 1200 },
  { id: 'cit-conference-hall', name: 'CIT Conference Hall', icon: '📊', lat: 11.0284536, lng: 77.0277633, category: 'facility', description: 'AC conference hall for board meetings, FDPs, and workshops.', floors: 1, capacity: 150, schedule: { weekday: { open: '09:00', close: '17:00' }, saturday: { open: 'CLOSED' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-placement', name: 'CIT Placement Cell', icon: '💼', lat: 11.0284049, lng: 77.0280091, category: 'facility', description: 'T&P office — aptitude coaching, mock interviews, campus recruitment drives.', floors: 2, capacity: 120, schedule: { weekday: { open: '09:00', close: '17:00' }, saturday: { open: 'CLOSED' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-placement-annex', name: 'Placement Office Annex', icon: '🤝', lat: 11.0286836, lng: 77.0277365, category: 'facility', description: 'Secondary placement coordination for industry liaison and internship processing.', floors: 1, capacity: 50 },
  { id: 'cit-poly-placement', name: 'Polytechnic Placement Cell', icon: '📋', lat: 11.0284227, lng: 77.0281495, category: 'facility', description: 'Placement cell for polytechnic diploma students.', floors: 1, capacity: 40 },
  { id: 'cit-canteen', name: 'CIT Campus Canteen', icon: '🍽️', lat: 11.0267061, lng: 77.0262027, category: 'facility', description: 'Main canteen serving South Indian breakfast, lunch, snacks, and dinner.', floors: 1, capacity: 400, schedule: { weekday: { open: '07:30', close: '21:00' }, saturday: { open: '08:00', close: '20:00' }, sunday: { open: '09:00', close: '18:00' } } },
  { id: 'cit-bakery', name: 'Jayaraj Pandian Bakery', icon: '🥐', lat: 11.0273130, lng: 77.0265151, category: 'facility', description: 'Popular on-campus bakery — buns, tea, and short eats.', floors: 1, capacity: 30, schedule: { weekday: { open: '07:00', close: '20:00' }, saturday: { open: '07:00', close: '18:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-atm-services', name: 'ATM / Stationery / Xerox / Grocery', icon: '🏦', lat: 11.0261949, lng: 77.0263209, category: 'facility', description: 'Multi-service hub: ATM, stationery, dispensary, Xerox, and grocery.', floors: 1, capacity: 20, schedule: { weekday: { open: '09:00', close: '18:00' }, saturday: { open: '09:00', close: '14:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-dispensary', name: 'Dispensary', icon: '🏥', lat: 11.0261949, lng: 77.0263700, category: 'facility', description: 'On-campus dispensary with nurse station and visiting doctor sessions.', floors: 1, capacity: 20, schedule: { weekday: { open: '08:00', close: '18:00' }, saturday: { open: '09:00', close: '14:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'cit-stadium', name: 'CIT Stadium (OAT)', icon: '🏟️', lat: 11.0294058, lng: 77.0284149, category: 'recreation', description: 'Main outdoor stadium — Open Air Theatre, athletics track, and large events ground.', floors: 0, capacity: 2000 },
  { id: 'cit-cricket-ground', name: 'CIT Cricket Ground', icon: '🏏', lat: 11.0266023, lng: 77.0275962, category: 'recreation', description: 'Full-size cricket ground for inter-college tournaments and practice.', floors: 0, capacity: 500 },
  { id: 'cit-kabaddi-ground', name: 'Kabaddi Ground', icon: '🤼', lat: 11.0269027, lng: 77.0265741, category: 'recreation', description: 'Dedicated kabaddi court — national-level tournaments hosted here.', floors: 0, capacity: 200 },
  { id: 'cit-ball-badminton', name: 'CIT Ball Badminton Court', icon: '🏸', lat: 11.0263336, lng: 77.0266385, category: 'recreation', description: 'Ball badminton court — CIT has strong national tradition in this sport.', floors: 0, capacity: 100 },
  { id: 'cit-volleyball', name: 'CIT Volleyball Court', icon: '🏐', lat: 11.0262783, lng: 77.0265151, category: 'recreation', description: 'Open volleyball court for inter-department and recreational play.', floors: 0, capacity: 100 },
  { id: 'cit-basketball', name: 'Basketball Court', icon: '🏀', lat: 11.0259308, lng: 77.0266063, category: 'recreation', description: 'Full-size cemented basketball court with hoops.', floors: 0, capacity: 100 },
  { id: 'cit-vehicle-parking', name: 'CIT Vehicle Parking', icon: '🅿️', lat: 11.0287759, lng: 77.0261837, category: 'facility', description: 'Main campus parking for students, staff, and visitors.', floors: 0, capacity: 300 },
  { id: 'cit-poly-parking', name: 'CIT Polytechnic Parking', icon: '🚗', lat: 11.0295060, lng: 77.0274786, category: 'facility', description: 'Dedicated parking near polytechnic entrance.', floors: 0, capacity: 150 },
  { id: 'cit-temple', name: 'Vinayagar Temple', icon: '🛕', lat: 11.0271730, lng: 77.0265866, category: 'facility', description: 'Campus Vinayagar (Ganesha) temple — open to all students and staff.', floors: 1, capacity: 100 },
  { id: 'cit-girls-hostel', name: 'Girls Hostel', icon: '🏩', lat: 11.0260356, lng: 77.0259128, category: 'residential', description: 'Female student block with 24/7 CCTV and warden supervision.', floors: 5, capacity: 600, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '20:30' } } } },
  { id: 'cit-girls-cooking', name: 'Girls Hostel Cooking Area', icon: '🍳', lat: 11.0256002, lng: 77.0260237, category: 'residential', description: 'Dedicated cooking and mess area for the girls hostel.', floors: 1, capacity: 100, schedule: { type: 'hostel', alldays: { gate: { open: '06:00', close: '21:00' } } } },
  { id: 'cit-boys-hostel-1', name: 'Boys Hostel 1', icon: '🏨', lat: 11.0247821, lng: 77.0272867, category: 'residential', description: 'Boys residential block 1 — general accommodation.', floors: 4, capacity: 200, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'cit-boys-mess-2', name: 'Boys Mess Block 2 (2nd–4th Year)', icon: '🍛', lat: 11.0249638, lng: 77.0279512, category: 'residential', description: 'Mess and dining for 2nd to 4th year boys hostel residents.', floors: 2, capacity: 300, schedule: { type: 'hostel', alldays: { gate: { open: '06:00', close: '22:00' } } } },
  { id: 'cit-boys-hostel-3', name: 'Boys Hostel 3 (1st Year)', icon: '🏢', lat: 11.0254650, lng: 77.0282787, category: 'residential', description: 'First-year boys hostel block with orientation facilities.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'cit-boys-hostel-4', name: 'Boys Hostel 4 (2nd–4th Year)', icon: '🏢', lat: 11.0256213, lng: 77.0289487, category: 'residential', description: '2nd–4th year male student residential block.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'cit-boys-hostel-5', name: 'Boys Hostel 5', icon: '🏢', lat: 11.0251171, lng: 77.0286859, category: 'residential', description: 'Boys hostel block 5 — additional residential accommodation.', floors: 4, capacity: 200, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'cit-boys-hostel-6', name: 'Boys Hostel 6', icon: '🏢', lat: 11.0254694, lng: 77.0293961, category: 'residential', description: 'Boys hostel block 6.', floors: 4, capacity: 200, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'cit-boys-hostel-7', name: 'Boys Hostel 7', icon: '🏢', lat: 11.0259915, lng: 77.0294703, category: 'residential', description: 'Boys hostel block 7 — easternmost residential block on campus.', floors: 4, capacity: 200, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
];

const kprBuildings: Building[] = [
  // Academic Buildings
  { id: 'kpr-admin-office', name: 'Administrative Office', icon: '🏛️', lat: 11.0768067, lng: 77.1421463, category: 'academic', description: 'Central administrative office — principal, registrar, and academic coordination.', floors: 3, capacity: 200, schedule: { weekday: { open: '09:00', close: '17:00' }, saturday: { open: '09:00', close: '13:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'kpr-aids-block', name: 'AI & DS Block', icon: '🤖', lat: 11.0767671, lng: 77.1421556, category: 'academic', description: 'Artificial Intelligence & Data Science department — deep learning labs and research.', floors: 4, capacity: 500 },
  { id: 'kpr-imperial-hall', name: 'Imperial Hall', icon: '🎭', lat: 11.0762763, lng: 77.1417560, category: 'academic', description: 'Main auditorium for convocations, symposia, and cultural events.', floors: 2, capacity: 1200 },
  { id: 'kpr-tnp-block', name: 'Training & Placement Block', icon: '💼', lat: 11.0762388, lng: 77.1417748, category: 'facility', description: 'T&P office — aptitude coaching, mock interviews, and campus recruitment drives.', floors: 2, capacity: 120, schedule: { weekday: { open: '09:00', close: '17:00' }, saturday: { open: 'CLOSED' }, sunday: { open: 'CLOSED' } } },
  { id: 'kpr-exam-cell', name: 'Exam Cell', icon: '📝', lat: 11.0762731, lng: 77.1418016, category: 'facility', description: 'Examination coordination — schedules, hall tickets, and results processing.', floors: 1, capacity: 50 },
  { id: 'kpr-rnd-block', name: 'R&D Block', icon: '🔬', lat: 11.0762711, lng: 77.1419470, category: 'academic', description: 'Research & Development centre — funded projects, patents, and innovation lab.', floors: 3, capacity: 200 },
  { id: 'kpr-mech-block', name: 'Mechanical Block', icon: '⚙️', lat: 11.0764183, lng: 77.1432830, category: 'academic', description: 'Mechanical Engineering department — thermal, CAD/CAM, and robotics labs.', floors: 4, capacity: 500 },
  { id: 'kpr-civil-eee', name: 'Civil & EEE Block', icon: '🏗️', lat: 11.0761591, lng: 77.1432803, category: 'academic', description: 'Civil Engineering and EEE departments — structural, power systems, and control labs.', floors: 4, capacity: 500 },
  { id: 'kpr-cas1', name: 'KPRCAS-1 (Arts & Science)', icon: '📖', lat: 11.0756061, lng: 77.1423282, category: 'academic', description: 'KPR College of Arts, Science & Research — Block 1.', floors: 3, capacity: 400 },
  { id: 'kpr-cas2', name: 'KPRCAS-2 (Arts & Science)', icon: '📖', lat: 11.0755930, lng: 77.1418239, category: 'academic', description: 'KPR College of Arts, Science & Research — Block 2.', floors: 3, capacity: 400 },
  { id: 'kpr-workshop', name: 'Engineering Workshop', icon: '🔧', lat: 11.0757509, lng: 77.1430255, category: 'academic', description: 'Central workshop — welding, fitting, smithy, and manufacturing practice.', floors: 1, capacity: 200 },
  { id: 'kpr-struct-lab', name: 'Structural Engg Lab', icon: '🧱', lat: 11.0764389, lng: 77.1436936, category: 'academic', description: 'Heavy structural testing laboratory — load frames, UTM, and concrete testing.', floors: 1, capacity: 100 },
  { id: 'kpr-chem-block', name: 'Chemical Engg Block', icon: '⚗️', lat: 11.0777218, lng: 77.1426906, category: 'academic', description: 'Chemical Engineering department — process simulation and reaction labs.', floors: 3, capacity: 300 },
  { id: 'kpr-sh-block', name: 'Science & Humanities Block', icon: '📚', lat: 11.0777192, lng: 77.1429373, category: 'academic', description: 'S&H department — physics, chemistry, math, and English for first-years.', floors: 3, capacity: 400 },
  { id: 'kpr-biomed', name: 'Bio-Medical Block', icon: '🧬', lat: 11.0774375, lng: 77.1433558, category: 'academic', description: 'Biomedical Engineering department — medical electronics and imaging labs.', floors: 3, capacity: 250 },
  { id: 'kpr-ece-block', name: 'ECE Block', icon: '📡', lat: 11.0771593, lng: 77.1428167, category: 'academic', description: 'Electronics & Communication Engineering — VLSI, embedded systems, and signal processing labs.', floors: 4, capacity: 500 },
  { id: 'kpr-cse-block', name: 'CSE Block', icon: '💻', lat: 11.0768855, lng: 77.1432002, category: 'academic', description: 'Computer Science & Engineering — AI/ML, cloud computing, and programming labs.', floors: 4, capacity: 600 },
  { id: 'kpr-library', name: 'Central Library', icon: '📚', lat: 11.0758968, lng: 77.1418775, category: 'academic', description: 'Central library with 80,000+ volumes, DELNET access, and digital reading zones.', floors: 3, capacity: 500, schedule: { weekday: { open: '08:00', close: '20:00' }, saturday: { open: '09:00', close: '17:00' }, sunday: { open: 'CLOSED' } } },
  // Facilities
  { id: 'kpr-food-court', name: 'Food Court', icon: '🍽️', lat: 11.0776919, lng: 77.1404599, category: 'facility', description: 'Multi-cuisine food court — South Indian, North Indian, Chinese, and juice counters.', floors: 1, capacity: 500, schedule: { weekday: { open: '07:30', close: '21:00' }, saturday: { open: '08:00', close: '20:00' }, sunday: { open: '09:00', close: '18:00' } } },
  { id: 'kpr-cafeteria', name: 'Cafeteria Dining', icon: '☕', lat: 11.0777270, lng: 77.1402498, category: 'facility', description: 'AC cafeteria for students and faculty — breakfast, lunch, and evening snacks.', floors: 1, capacity: 300, schedule: { weekday: { open: '07:00', close: '20:00' }, saturday: { open: '07:00', close: '18:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'kpr-garden-cafe', name: 'Garden Cafe', icon: '🌿', lat: 11.0763496, lng: 77.1426608, category: 'facility', description: 'Open-air garden café for light refreshments in a green setting.', floors: 1, capacity: 80 },
  { id: 'kpr-stationery', name: 'Stationery Shop', icon: '🖨️', lat: 11.0777112, lng: 77.1408399, category: 'facility', description: 'Stationery, photocopy, printing, and academic supplies.', floors: 1, capacity: 15, schedule: { weekday: { open: '08:00', close: '18:00' }, saturday: { open: '08:00', close: '14:00' }, sunday: { open: 'CLOSED' } } },
  { id: 'kpr-kalaiarangam', name: 'KPR Kalaiarangam', icon: '🎪', lat: 11.0777883, lng: 77.1421529, category: 'facility', description: 'Cultural arts centre — theatre, music, dance, and fine arts facility.', floors: 2, capacity: 600 },
  { id: 'kpr-open-theatre', name: 'Open Theatre', icon: '🎬', lat: 11.0767696, lng: 77.1426826, category: 'recreation', description: 'Open-air amphitheatre for cultural performances and movie screenings.', floors: 0, capacity: 800 },
  { id: 'kpr-security', name: 'Security Gate', icon: '🛡️', lat: 11.0777186, lng: 77.1394387, category: 'facility', description: 'Main security post with visitor registration and vehicle checkpoint.', floors: 1, capacity: 10 },
  { id: 'kpr-bike-parking', name: 'Bike Parking', icon: '🏍️', lat: 11.0776893, lng: 77.1398189, category: 'facility', description: 'Two-wheeler parking zone near the main entrance.', floors: 0, capacity: 500 },
  { id: 'kpr-car-parking', name: 'Car Parking', icon: '🅿️', lat: 11.0769816, lng: 77.1408018, category: 'facility', description: 'Four-wheeler parking area for staff and visitors.', floors: 0, capacity: 200 },
  // Hostels
  { id: 'kpr-ganga-hostel', name: 'Ganga Girls Hostel', icon: '🏩', lat: 11.0745492, lng: 77.1432180, category: 'residential', description: 'Girls hostel block — Ganga wing with 24/7 CCTV and warden supervision.', floors: 4, capacity: 300, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '20:30' } } } },
  { id: 'kpr-yamuna-hostel', name: 'Yamuna Girls Hostel', icon: '🏩', lat: 11.0747098, lng: 77.1426815, category: 'residential', description: 'Girls hostel block — Yamuna wing.', floors: 4, capacity: 300, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '20:30' } } } },
  { id: 'kpr-kaveri-hostel', name: 'Kaveri Girls Hostel', icon: '🏩', lat: 11.0747493, lng: 77.1423221, category: 'residential', description: 'Girls hostel block — Kaveri wing.', floors: 4, capacity: 300, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '20:30' } } } },
  { id: 'kpr-girls-mess', name: 'Girls Mess', icon: '🍛', lat: 11.0748309, lng: 77.1427058, category: 'facility', description: 'Mess and dining hall for girls hostel residents.', floors: 1, capacity: 400, schedule: { type: 'hostel', alldays: { gate: { open: '06:00', close: '21:00' } } } },
  { id: 'kpr-boys-mess', name: 'Boys Mess', icon: '🍛', lat: 11.0792984, lng: 77.1428186, category: 'facility', description: 'Mess and dining hall for boys hostel residents.', floors: 1, capacity: 400, schedule: { type: 'hostel', alldays: { gate: { open: '06:00', close: '22:00' } } } },
  { id: 'kpr-bharathi-hostel', name: 'Bharathi Boys Hostel', icon: '🏨', lat: 11.0791563, lng: 77.1426577, category: 'residential', description: 'Boys hostel — Bharathi block.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'kpr-cheran-hostel', name: 'Cheran Boys Hostel', icon: '🏨', lat: 11.0786456, lng: 77.1425182, category: 'residential', description: 'Boys hostel — Cheran block.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'kpr-cholan-hostel', name: 'Cholan Boys Hostel', icon: '🏨', lat: 11.0790457, lng: 77.1418369, category: 'residential', description: 'Boys hostel — Cholan block.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'kpr-pandian-hostel', name: 'Pandian Boys Hostel', icon: '🏨', lat: 11.0790510, lng: 77.1414989, category: 'residential', description: 'Boys hostel — Pandian block.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  { id: 'kpr-pallavan-hostel', name: 'Pallavan Boys Hostel', icon: '🏨', lat: 11.0793984, lng: 77.1416438, category: 'residential', description: 'Boys hostel — Pallavan block.', floors: 4, capacity: 250, schedule: { type: 'hostel', alldays: { gate: { open: '05:30', close: '21:30' } } } },
  // Sports & Recreation
  { id: 'kpr-basketball', name: 'Basketball Courts', icon: '🏀', lat: 11.0798959, lng: 77.1412866, category: 'recreation', description: 'Outdoor basketball courts with floodlights.', floors: 0, capacity: 100 },
  { id: 'kpr-tennis', name: 'Tennis Courts', icon: '🎾', lat: 11.0800249, lng: 77.1415467, category: 'recreation', description: 'Professional tennis courts.', floors: 0, capacity: 50 },
  { id: 'kpr-volleyball', name: 'Volleyball Courts', icon: '🏐', lat: 11.0797433, lng: 77.1415629, category: 'recreation', description: 'Outdoor volleyball courts for inter-department play.', floors: 0, capacity: 100 },
  { id: 'kpr-cricket', name: 'Cricket Ground', icon: '🏏', lat: 11.0811177, lng: 77.1416777, category: 'recreation', description: 'Full-size cricket ground for inter-college tournaments.', floors: 0, capacity: 1000 },
  { id: 'kpr-football', name: 'Track & Football Ground', icon: '⚽', lat: 11.0811046, lng: 77.1425092, category: 'recreation', description: 'Athletics track and football ground — national-level events hosted here.', floors: 0, capacity: 1500 },
  { id: 'kpr-indoor-badminton', name: 'Indoor Badminton Courts', icon: '🏸', lat: 11.0805500, lng: 77.1413381, category: 'recreation', description: 'Indoor badminton facility with synthetic courts.', floors: 1, capacity: 100 },
  { id: 'kpr-celebration-zone', name: 'Celebration Zone', icon: '🎉', lat: 11.0785838, lng: 77.1415452, category: 'recreation', description: 'Event celebration area for campus festivals and gatherings.', floors: 0, capacity: 500 },
  { id: 'kpr-multipurpose', name: 'Multi Purpose Hall', icon: '🏋️', lat: 11.0785153, lng: 77.1413547, category: 'recreation', description: 'Indoor multipurpose hall — sports, yoga, and cultural rehearsals.', floors: 1, capacity: 300 },
  { id: 'kpr-gym', name: 'Gym', icon: '💪', lat: 11.0783995, lng: 77.1413628, category: 'recreation', description: 'Fully equipped fitness centre for students and staff.', floors: 1, capacity: 50 },
];

export const campuses: Campus[] = [
  {
    id: 'sjce',
    name: "St. Joseph's College of Engineering",
    shortName: 'SJCE',
    center: [12.8693, 80.2170],
    color: '#00D2FF',
    colorVar: '--aurora-1',
    buildings: sjceBuildings,
  },
  {
    id: 'sjit',
    name: "St. Joseph's Institute of Technology",
    shortName: 'SJIT',
    center: [12.8692, 80.2192],
    color: '#7B2FFF',
    colorVar: '--aurora-2',
    buildings: sjitBuildings,
  },
  {
    id: 'cit',
    name: 'Coimbatore Institute of Technology',
    shortName: 'CIT',
    center: [11.0275, 77.0273],
    color: '#FF6B35',
    colorVar: '--solar',
    buildings: citBuildings,
  },
  {
    id: 'kpr',
    name: 'KPR Institute of Technology',
    shortName: 'KPR',
    center: [11.0775, 77.1418],
    color: '#06D6A0',
    colorVar: '--aurora-3',
    buildings: kprBuildings,
  },
];
export function getBuildingStatus(building: Building): { status: 'open' | 'closing' | 'closed' | 'restricted' | 'always'; label: string; color: string } {
  if (!building.schedule) {
    return { status: 'always', label: 'ALWAYS OPEN', color: 'var(--aurora-3)' };
  }

  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  let todaySchedule: { open: string; close?: string } | undefined;

  if (building.schedule.type === 'hostel' && building.schedule.alldays) {
    const gate = building.schedule.alldays.gate;
    if (gate) todaySchedule = gate;
  } else if (day === 0) {
    todaySchedule = building.schedule.sunday;
  } else if (day === 6) {
    todaySchedule = building.schedule.saturday;
  } else {
    todaySchedule = building.schedule.weekday;
  }

  if (!todaySchedule || todaySchedule.open === 'CLOSED') {
    return { status: 'closed', label: 'CLOSED', color: 'var(--nova)' };
  }

  const [openH, openM] = todaySchedule.open.split(':').map(Number);
  const [closeH, closeM] = (todaySchedule.close || '23:59').split(':').map(Number);
  const openMin = openH * 60 + openM;
  const closeMin = closeH * 60 + closeM;

  if (currentMinutes < openMin) {
    return { status: 'closed', label: `OPENS AT ${todaySchedule.open}`, color: 'var(--nova)' };
  }

  if (currentMinutes >= closeMin) {
    return { status: 'closed', label: 'CLOSED', color: 'var(--nova)' };
  }

  const minutesLeft = closeMin - currentMinutes;
  if (minutesLeft <= 30) {
    return { status: 'closing', label: `CLOSES IN ${minutesLeft} MIN`, color: 'var(--solar)' };
  }

  return { status: 'open', label: 'OPEN', color: 'var(--aurora-3)' };
}

export const categoryColors: Record<BuildingCategory, string> = {
  academic: 'hsl(var(--aurora-1))',
  residential: 'hsl(var(--aurora-2))',
  facility: 'hsl(var(--solar))',
  recreation: 'hsl(var(--aurora-3))',
};

export const categoryLabels: Record<BuildingCategory, string> = {
  academic: 'Academic',
  residential: 'Residential',
  facility: 'Facility',
  recreation: 'Recreation',
};
