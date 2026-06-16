/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrafficSign, SignCategory } from "../types";

export const TRAFFIC_SIGNS_DB: TrafficSign[] = [
  {
    id: "sign_stop",
    nameEn: "Stop Sign",
    nameKh: "ឈប់",
    category: SignCategory.REGULATORY,
    descriptionEn: "Indicates that you must come to a complete stop, yield the right of way to traffic, and proceed only when safe.",
    descriptionKh: "តម្រូវឱ្យអ្នកបើកបរធ្វើការបញ្ឈប់យានយន្តទាំងស្រុង ផ្តល់អាទិភាពដល់យានជំនិះដទៃទៀត ហើយអាចបន្តដំណើរទៅមុខបានលុះត្រាតែមានសុវត្ថិភាព។",
    phoneticKh: "Chhob",
    svgType: "stop",
    shape: "octagon",
    primaryColor: "#DC2626", // Red Hex
    rulesEn: "Completely stop before the stop line, look for cross traffic and pedestrians, yield rights, and then proceed.",
    rulesKh: "ត្រូវបញ្ឈប់យានយន្តទាំងស្រុងនៅមុខខ្សែបន្ទាត់ឈប់ ពិនិត្យមើលចរាចរណ៍ទទឹងផ្លូវ និងអ្នកថ្មើរជើង រួចផ្តល់សិទ្ធិអាទិភាពសិន ទើបអាចបន្តដំណើរទៅបាន។"
  },
  {
    id: "sign_no_entry",
    nameEn: "No Entry",
    nameKh: "ហាមចូល",
    category: SignCategory.REGULATORY,
    descriptionEn: "Indicates that entry is forbidden for all vehicles. Commonly placed at the exit of one-way streets or restricted areas.",
    descriptionKh: "ហាមឃាត់ការចូលចំពោះយានជំនិះគ្រប់ប្រភេទ។ ជាទូទៅត្រូវបានដាក់នៅផ្លូវចេញនៃផ្លូវឯកទិស ឬតំបន់ហាមឃាត់។",
    phoneticKh: "Harm Jol",
    svgType: "no_entry",
    shape: "circle",
    primaryColor: "#DC2626",
    rulesEn: "Do not enter this road, as it is traveling in the opposite direction or blocked for safety.",
    rulesKh: "មិនត្រូវធ្វើដំណើរចូលទៅក្នុងផ្លូវនេះជាដាច់ខាត ព្រោះវាជាផ្លូវបញ្ច្រាសទិស ឬត្រូវបានបិទដើម្បីសុវត្ថិភាព។"
  },
  {
    id: "sign_no_left_turn",
    nameEn: "No Left Turn",
    nameKh: "ហាមបត់ឆ្វេង",
    category: SignCategory.REGULATORY,
    descriptionEn: "Prohibits drivers from turning left at the upcoming intersection or designated driveway.",
    descriptionKh: "ហាមឃាត់អ្នកបើកបរមិនឱ្យបត់ឆ្វេងនៅផ្លូវប្រសព្វខាងមុខ ឬច្រកចូលដែលបានកំណត់។",
    phoneticKh: "Harm Bawt Chhveng",
    svgType: "no_left_turn",
    shape: "circle",
    primaryColor: "#DC2626",
    rulesEn: "Drivers must continue straight or turn right. Making a left turn here is illegal and highly dangerous.",
    rulesKh: "អ្នកបើកបរត្រូវតែបន្តទៅត្រង់ ឬបត់ស្តាំ។ ការបត់ឆ្វេងនៅទីនេះខុសច្បាប់ និងបង្កគ្រោះថ្នាក់ខ្លាំង។"
  },
  {
    id: "sign_no_right_turn",
    nameEn: "No Right Turn",
    nameKh: "ហាមបត់ស្តាំ",
    category: SignCategory.REGULATORY,
    descriptionEn: "Prohibits vehicles from turning right at this specific location or intersection.",
    descriptionKh: "ហាមឃាត់យានយន្តមិនឱ្យបត់ស្តាំនៅទីតាំង ឬផ្លូវប្រសព្វនេះ។",
    phoneticKh: "Harm Bawt Sdam",
    svgType: "no_right_turn",
    shape: "circle",
    primaryColor: "#DC2626",
    rulesEn: "Keep going straight or turn left. A right turn is disallowed due to crossing traffic dangers.",
    rulesKh: "បន្តទៅត្រង់ ឬបត់ឆ្វេង។ ការបត់ស្តាំត្រូវបានហាមឃាត់ដោយសារគ្រោះថ្នាក់ចរាចរណ៍កាត់ទទឹងផ្លូវ។"
  },
  {
    id: "sign_speed_30",
    nameEn: "Speed Limit 30 km/h",
    nameKh: "ល្បឿនកំណត់ ៣០គម/ម៉",
    category: SignCategory.SPEED_LIMIT,
    descriptionEn: "Specifies the maximum legal driving speed is 30 km/h. Often found in school, residential, or highly crowded urban zones.",
    descriptionKh: "កំណត់ល្បឿនបើកបរអតិបរមាស្របច្បាប់គឺ ៣០ គីឡូម៉ែត្រក្នុងមួយម៉ោង។ ជាទូទៅត្រូវបានជួបនៅក្នុងតំបន់សាលារៀន លំនៅដ្ឋាន ឬតំបន់ប្រជុំជនអ៊ូអរ។",
    phoneticKh: "Leub-leuan Kam-not Sam-seb",
    svgType: "speed_30",
    shape: "circle",
    primaryColor: "#DC2626",
    rulesEn: "Do not exceed 30 km/h under normal conditions. Drive slowly, watch for children, pedestrians, and cyclists.",
    rulesKh: "មិនត្រូវបើកបរលើសល្បឿន ៣០ គីឡូម៉ែត្រក្នុងមួយម៉ោងក្នុងស្ថានភាពធម្មតាឡើយ។ បើកបរយឺតៗ ប្រុងប្រយ័ត្នក្មេងៗ អ្នកថ្មើរជើង និងកង់។"
  },
  {
    id: "sign_speed_50",
    nameEn: "Speed Limit 50 km/h",
    nameKh: "ល្បឿនកំណត់ ៥០គម/ម៉",
    category: SignCategory.SPEED_LIMIT,
    descriptionEn: "Restricts maximum speed to 50 km/h. Prominent on standard city primary streets and municipal lanes in Cambodia.",
    descriptionKh: "កម្រិតល្បឿនបើកបរអតិបរមា ៥០ គីឡូម៉ែត្រក្នុងមួយម៉ោង។ ត្រូវបានប្រើនៅលើផ្លូវធំក្នុងទីក្រុង និងតាមមហាវិថីនានាក្នុងប្រទេសកម្ពុជា។",
    phoneticKh: "Leub-leuan Kam-not Ha-seb",
    svgType: "speed_50",
    shape: "circle",
    primaryColor: "#DC2626",
    rulesEn: "Adjust your speed to stay at or below 50 km/h. Essential speed control for high-density vehicle and motorbike merging.",
    rulesKh: "លៃតម្រូវល្បឿនរបស់អ្នកឱ្យនៅស្មើ ឬក្រោម ៥០ គីឡូម៉ែត្រក្នុងមួយម៉ោង។ សំខាន់សម្រាប់ការគ្រប់គ្រងល្បឿនក្នុងតំបន់ដែលមានម៉ូតូ និងឡានច្រើន។"
  },
  {
    id: "sign_no_overtaking",
    nameEn: "No Overtaking",
    nameKh: "ហាមជែងគ្នា",
    category: SignCategory.REGULATORY,
    descriptionEn: "Informs drivers that passing or overtaking other cars is prohibited due to poor visibility, narrow lanes, or road safety risks.",
    descriptionKh: "ប្រាប់អ្នកបើកបរថាការជែង ឬជំពប់ជែងរថយន្តដទៃទៀតត្រូវបានហាមឃាត់ ដោយសារចម្ងាយមើលឃើញមិនច្បាស់ គន្លងផ្លូវតូចចង្អៀត ឬហានិភ័យសុវត្ថិភាព។",
    phoneticKh: "Harm Cheng Knea",
    svgType: "no_overtaking",
    shape: "circle",
    primaryColor: "#DC2626",
    rulesEn: "Keep in your lane and do not cross centers to overtake ahead. Remain behind vehicles until the restriction is lifted.",
    rulesKh: "រក្សាខ្លួននៅក្នុងគន្លងផ្លូវរបស់អ្នក ហើយកុំឆ្លងកាត់ខ្សែបន្ទាត់កណ្តាលដើម្បីជែង។ រក្សានៅពីក្រោយយានជំនិះដទៃរហូតដល់ផុតផ្លូវហាមជែង។"
  },
  {
    id: "sign_warning_pedestrian",
    nameEn: "Pedestrian Crossing Ahead",
    nameKh: "អ្នកថ្មើរជើងឆ្លងកាត់ខាងមុខ",
    category: SignCategory.WARNING,
    descriptionEn: "Warns drivers of an upcoming crosswalk ahead where school children or walkers frequently cross the road.",
    descriptionKh: "ដាស់តឿនអ្នកបើកបរអំពីវត្តមានគំនូសសញ្ញាថ្មើរជើងឆ្លងកាត់ខាងមុខ ដែលមានសិស្សសាលា ឬអ្នកដំណើរថ្មើរជើងឧស្សាហ៍ឆ្លងកាត់ផ្លូវ។",
    phoneticKh: "Neak Thmer-cheung Chhlong-kat Khang-mokh",
    svgType: "warning_pedestrian",
    shape: "triangle",
    primaryColor: "#EAB308", // Amber/Yellow
    rulesEn: "Slow down, keep attention on both sidewalks, and be ready to yield right of way to any crossing pedestrian.",
    rulesKh: "បន្ថយល្បឿន យកចិត្តទុកដាក់លើចិញ្ចើមផ្លូវទាំងសងខាង និងត្រៀមខ្លួនផ្តល់សិទ្ធិអាទិភាពដល់អ្នកថ្មើរជើងដែលកំពុងឆ្លងកាត់។"
  },
  {
    id: "sign_warning_school",
    nameEn: "School Zone Ahead",
    nameKh: "តំបន់សាលារៀនខាងមុខ",
    category: SignCategory.WARNING,
    descriptionEn: "Alerts drivers that a school is nearby. Children may be crossing, and speeds should be reduced significantly.",
    descriptionKh: "ដាស់តឿនអ្នកបើកបរថាមានសាលារៀននៅក្បែរនោះ។ កុមារអាចនឹងកំពុងឆ្លងកាត់ថ្នល់ ហើយល្បឿនគួរត្រូវបានបន្ថយចុះជាអតិបរមា។",
    phoneticKh: "Tomboun Salar-rien Khang-mokh",
    svgType: "warning_school",
    shape: "triangle",
    primaryColor: "#EAB308",
    rulesEn: "Drive with extreme caution, drop speeds around 20-30 km/h, keep a sharp lookout for running school children.",
    rulesKh: "បើកបរដោយការប្រុងប្រយ័ត្នខ្ពស់បំផុត បន្ថយល្បឿនមកត្រឹមប្រហែល ២០-៣០ គម/ម៉ និងយកចិត្តទុកដាក់មើលកូនសិស្សតូចៗដែលអាចរត់ឆ្លងផ្លូវ។"
  },
  {
    id: "sign_warning_roundabout",
    nameEn: "Roundabout Ahead",
    nameKh: "រង្វង់មូលខាងមុខ",
    category: SignCategory.WARNING,
    descriptionEn: "Warns that a circular intersection is coming up. Drivers must get ready to follow yielding guidelines and circular entry rules.",
    descriptionKh: "ដាស់តឿនថា ផ្លូវប្រសព្វរង្វង់មូលកំពុងមាននៅខាងមុខ។ អ្នកបើកបរត្រូវត្រៀមខ្លួនអនុវត្តតាមការផ្តល់សិទ្ធិអាទិភាព និងវិធានចូលរង្វង់មូល។",
    phoneticKh: "Rong-vong Mul Khang-mokh",
    svgType: "warning_roundabout",
    shape: "triangle",
    primaryColor: "#EAB308",
    rulesEn: "Reduce speed, yield to any vehicles already inside the circular turn on your left side before entering.",
    rulesKh: "បន្ថយល្បឿន ផ្តល់អាទិភាពដល់យានជំនិះដែលកំពុងធ្វើដំណើរនៅក្នុងរង្វង់មូលដែលនៅខាងឆ្វេងដៃរបស់អ្នកមុននឹងចូលទៅ។"
  },
  {
    id: "sign_one_way",
    nameEn: "One-Way Street",
    nameKh: "ផ្លូវឯកទិស",
    category: SignCategory.INFORMATION,
    descriptionEn: "Indicates that the street is configured for one-way traffic flow only in the direction of the arrow.",
    descriptionKh: "បង្ហាញថាផ្លូវនេះត្រូវបានរៀបចំឡើងសម្រាប់ការធ្វើចរាចរណ៍តែមួយទិសដៅប៉ុណ្ណោះ ទៅតាមទិសដៅនៃព្រួញចង្អុល។",
    phoneticKh: "Phlov Ek-tis",
    svgType: "one_way",
    shape: "rectangle",
    primaryColor: "#2563EB", // Blue Hex
    rulesEn: "Drive only in the direction of the arrow. Do not turn around or reverse opposite to the legal flow.",
    rulesKh: "បើកបរទៅតាមទិសដៅចង្អុលនៃព្រួញប៉ុណ្ណោះ។ មិនត្រូវបត់ត្រឡប់ក្រោយ ឬបើកថយក្រោយបញ្ច្រាសទិសចរាចរណ៍ឡើយ។"
  },
  {
    id: "sign_parking",
    nameEn: "Parking Area",
    nameKh: "ចំណតរថយន្ត",
    category: SignCategory.INFORMATION,
    descriptionEn: "Designates an area officially allocated and marked for parking vehicles safely.",
    descriptionKh: "កំណត់តំបន់ដែលត្រូវបានបម្រុងទុកជាផ្លូវការ និងគូសចំណាំសម្រាប់ចតយានយន្តដោយសុវត្ថិភាព។",
    phoneticKh: "Chom-not Ro-theak-yont",
    svgType: "parking",
    shape: "rectangle",
    primaryColor: "#2563EB",
    rulesEn: "You can park your car within designated slot markings. Be careful when reversing out.",
    rulesKh: "អ្នកអាចចតយានយន្តរបស់អ្នកទៅតាមខ្សែបន្ទាត់ចំណតដែលបានកំណត់។ ត្រូវប្រុងប្រយ័ត្នពេលបើកថយក្រោយចេញពីចំណត។"
  }
];
