import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const INITIAL_CHARACTERS = [
  // 수(水) 오행
  { 
    character: '潤', unicode: 'U+6F64', strokeCount: 15, radical: '水',
    koreanSound: '윤', koreanMeaning: '윤택하다',
    primaryElement: '수', elementStrength: 90, 
    elementReason: '물 부수 + 윤택한 의미',
    nameSuitability: 85, genderPreference: '중성',
    meaningCategory: '재물/풍요', 
    positiveMeaning: '재물이 풍성하고 윤택함',
    numerologyLuck: '길'
  },
  { 
    character: '澈', unicode: 'U+6F88', strokeCount: 15, radical: '水',
    koreanSound: '철', koreanMeaning: '맑다',
    primaryElement: '수', elementStrength: 85,
    elementReason: '물 부수 + 맑은 의미',
    nameSuitability: 80, genderPreference: '중성',
    meaningCategory: '순수/청렴',
    positiveMeaning: '맑고 깨끗한 품성',
    numerologyLuck: '길'
  },
  {
    character: '淸', unicode: 'U+6DF8', strokeCount: 11, radical: '水',
    koreanSound: '청', koreanMeaning: '맑다',
    primaryElement: '수', elementStrength: 85,
    elementReason: '물 부수 + 청정한 의미',
    nameSuitability: 85, genderPreference: '중성',
    meaningCategory: '순수/청렴',
    positiveMeaning: '맑고 깨끗함',
    numerologyLuck: '길'
  },
  {
    character: '海', unicode: 'U+6D77', strokeCount: 10, radical: '水',
    koreanSound: '해', koreanMeaning: '바다',
    primaryElement: '수', elementStrength: 95,
    elementReason: '물 부수 + 바다 의미',
    nameSuitability: 80, genderPreference: '남성',
    meaningCategory: '포용/너그러움',
    positiveMeaning: '바다처럼 넓은 마음',
    numerologyLuck: '길'
  },
  
  // 목(木) 오행
  { 
    character: '榮', unicode: 'U+69AE', strokeCount: 14, radical: '木',
    koreanSound: '영', koreanMeaning: '영화롭다',
    primaryElement: '목', elementStrength: 85,
    elementReason: '나무 부수 + 번영 의미',
    nameSuitability: 90, genderPreference: '중성',
    meaningCategory: '성공/명예',
    positiveMeaning: '번영하고 영화로움',
    numerologyLuck: '대길'
  },
  { 
    character: '桓', unicode: 'U+6853', strokeCount: 10, radical: '木',
    koreanSound: '환', koreanMeaning: '큰 나무',
    primaryElement: '목', elementStrength: 80,
    elementReason: '나무 부수 + 큰 의미',
    nameSuitability: 75, genderPreference: '남성',
    meaningCategory: '성장/발전',
    positiveMeaning: '크게 성장하는 기운',
    numerologyLuck: '길'
  },
  {
    character: '林', unicode: 'U+6797', strokeCount: 8, radical: '木',
    koreanSound: '림', koreanMeaning: '숲',
    primaryElement: '목', elementStrength: 90,
    elementReason: '나무가 두 개 모인 숲',
    nameSuitability: 75, genderPreference: '중성',
    meaningCategory: '화합/번영',
    positiveMeaning: '무성하게 자라는 숲',
    numerologyLuck: '길'
  },
  {
    character: '柱', unicode: 'U+67F1', strokeCount: 9, radical: '木',
    koreanSound: '주', koreanMeaning: '기둥',
    primaryElement: '목', elementStrength: 80,
    elementReason: '나무 부수 + 기둥 의미',
    nameSuitability: 80, genderPreference: '남성',
    meaningCategory: '리더십/책임',
    positiveMeaning: '든든한 기둥 같은 존재',
    numerologyLuck: '길'
  },
  
  // 화(火) 오행
  { 
    character: '煥', unicode: 'U+7165', strokeCount: 13, radical: '火',
    koreanSound: '환', koreanMeaning: '빛나다',
    primaryElement: '화', elementStrength: 85,
    elementReason: '불 부수 + 빛나는 의미',
    nameSuitability: 80, genderPreference: '남성',
    meaningCategory: '명예/광명',
    positiveMeaning: '밝게 빛나는 명예',
    numerologyLuck: '길'
  },
  {
    character: '炫', unicode: 'U+70AB', strokeCount: 9, radical: '火',
    koreanSound: '현', koreanMeaning: '빛나다',
    primaryElement: '화', elementStrength: 85,
    elementReason: '불 부수 + 현란한 의미',
    nameSuitability: 75, genderPreference: '중성',
    meaningCategory: '재능/빛남',
    positiveMeaning: '재능이 빛나다',
    numerologyLuck: '길'
  },
  {
    character: '昇', unicode: 'U+6607', strokeCount: 8, radical: '日',
    koreanSound: '승', koreanMeaning: '오르다',
    primaryElement: '화', elementStrength: 75,
    elementReason: '해 부수 + 상승 의미',
    nameSuitability: 85, genderPreference: '남성',
    meaningCategory: '성공/발전',
    positiveMeaning: '계속 상승하는 운세',
    numerologyLuck: '대길'
  },
  {
    character: '明', unicode: 'U+660E', strokeCount: 8, radical: '日',
    koreanSound: '명', koreanMeaning: '밝다',
    primaryElement: '화', elementStrength: 80,
    elementReason: '해와 달이 합쳐진 밝음',
    nameSuitability: 85, genderPreference: '중성',
    meaningCategory: '지혜/총명',
    positiveMeaning: '밝고 총명함',
    numerologyLuck: '길'
  },
  
  // 토(土) 오행
  { 
    character: '垣', unicode: 'U+57A3', strokeCount: 9, radical: '土',
    koreanSound: '원', koreanMeaning: '담/울타리',
    primaryElement: '토', elementStrength: 75,
    elementReason: '흙 부수 + 보호 의미',
    nameSuitability: 70, genderPreference: '중성',
    meaningCategory: '안정/보호',
    positiveMeaning: '든든한 울타리 같은 존재',
    numerologyLuck: '중길'
  },
  {
    character: '培', unicode: 'U+57F9', strokeCount: 11, radical: '土',
    koreanSound: '배', koreanMeaning: '기르다',
    primaryElement: '토', elementStrength: 80,
    elementReason: '흙 부수 + 양육 의미',
    nameSuitability: 75, genderPreference: '중성',
    meaningCategory: '성장/양육',
    positiveMeaning: '기르고 성장시키는 힘',
    numerologyLuck: '길'
  },
  {
    character: '堅', unicode: 'U+5805', strokeCount: 12, radical: '土',
    koreanSound: '견', koreanMeaning: '굳다',
    primaryElement: '토', elementStrength: 85,
    elementReason: '흙 부수 + 견고한 의미',
    nameSuitability: 80, genderPreference: '남성',
    meaningCategory: '의지/굳건함',
    positiveMeaning: '굳건한 의지',
    numerologyLuck: '길'
  },
  
  // 금(金) 오행
  { 
    character: '鉉', unicode: 'U+9249', strokeCount: 13, radical: '金',
    koreanSound: '현', koreanMeaning: '솥 들개',
    primaryElement: '금', elementStrength: 80,
    elementReason: '금속 부수 + 도구 의미',
    nameSuitability: 75, genderPreference: '남성',
    meaningCategory: '도구/능력',
    positiveMeaning: '중요한 역할을 하는 인재',
    numerologyLuck: '길'
  },
  {
    character: '鎭', unicode: 'U+93AD', strokeCount: 18, radical: '金',
    koreanSound: '진', koreanMeaning: '진압하다',
    primaryElement: '금', elementStrength: 85,
    elementReason: '금속 부수 + 안정 의미',
    nameSuitability: 80, genderPreference: '남성',
    meaningCategory: '안정/통솔',
    positiveMeaning: '안정을 가져오는 힘',
    numerologyLuck: '길'
  },
  {
    character: '錫', unicode: 'U+932B', strokeCount: 16, radical: '金',
    koreanSound: '석', koreanMeaning: '주석/주다',
    primaryElement: '금', elementStrength: 80,
    elementReason: '금속 부수',
    nameSuitability: 75, genderPreference: '남성',
    meaningCategory: '베풂/은혜',
    positiveMeaning: '베푸는 마음',
    numerologyLuck: '길'
  },
  
  // 추가 인기 한자들
  {
    character: '賢', unicode: 'U+8CE2', strokeCount: 15, radical: '貝',
    koreanSound: '현', koreanMeaning: '어질다',
    primaryElement: '토', elementStrength: 70,
    elementReason: '품성과 덕을 나타냄',
    nameSuitability: 90, genderPreference: '중성',
    meaningCategory: '지혜/덕성',
    positiveMeaning: '어질고 현명함',
    numerologyLuck: '대길'
  },
  {
    character: '智', unicode: 'U+667A', strokeCount: 12, radical: '日',
    koreanSound: '지', koreanMeaning: '지혜',
    primaryElement: '화', elementStrength: 70,
    elementReason: '밝은 지혜를 나타냄',
    nameSuitability: 85, genderPreference: '중성',
    meaningCategory: '지혜/총명',
    positiveMeaning: '뛰어난 지혜',
    numerologyLuck: '길'
  },
  {
    character: '仁', unicode: 'U+4EC1', strokeCount: 4, radical: '人',
    koreanSound: '인', koreanMeaning: '어질다',
    primaryElement: '목', elementStrength: 70,
    elementReason: '사람과 덕을 나타냄',
    nameSuitability: 85, genderPreference: '중성',
    meaningCategory: '인덕/배려',
    positiveMeaning: '어진 마음',
    numerologyLuck: '길'
  }
];

const ELEMENT_RULES = [
  // 부수로 분류
  { ruleType: 'radical', ruleValue: '木', element: '목', priority: 100, description: '나무 부수를 가진 한자' },
  { ruleType: 'radical', ruleValue: '火', element: '화', priority: 100, description: '불 부수를 가진 한자' },
  { ruleType: 'radical', ruleValue: '水', element: '수', priority: 100, description: '물 부수를 가진 한자' },
  { ruleType: 'radical', ruleValue: '金', element: '금', priority: 100, description: '금속 부수를 가진 한자' },
  { ruleType: 'radical', ruleValue: '土', element: '토', priority: 100, description: '흙 부수를 가진 한자' },
  
  // 의미로 분류
  { ruleType: 'meaning', ruleValue: '산|언덕|땅', element: '토', priority: 80, description: '지형 관련 한자' },
  { ruleType: 'meaning', ruleValue: '나무|숲|꽃', element: '목', priority: 80, description: '식물 관련 한자' },
  { ruleType: 'meaning', ruleValue: '강|바다|비', element: '수', priority: 80, description: '물 관련 한자' },
  { ruleType: 'meaning', ruleValue: '빛|태양|열', element: '화', priority: 80, description: '빛과 열 관련 한자' },
  { ruleType: 'meaning', ruleValue: '철|동|금', element: '금', priority: 80, description: '금속 관련 한자' },
  
  // 음으로 분류 (음오행)
  { ruleType: 'sound', ruleValue: 'ㄱㅋ', element: '목', priority: 60, description: '아음(牙音)' },
  { ruleType: 'sound', ruleValue: 'ㄴㄷㄹㅌ', element: '화', priority: 60, description: '설음(舌音)' },
  { ruleType: 'sound', ruleValue: 'ㅇㅎ', element: '토', priority: 60, description: '후음(喉音)' },
  { ruleType: 'sound', ruleValue: 'ㅅㅈㅊ', element: '금', priority: 60, description: '치음(齒音)' },
  { ruleType: 'sound', ruleValue: 'ㅁㅂㅍ', element: '수', priority: 60, description: '순음(脣音)' }
];

async function seed() {
  console.log('🌱 Seeding database...');
  
  // 한자 데이터 입력
  for (const char of INITIAL_CHARACTERS) {
    await prisma.chineseCharacter.upsert({
      where: { character: char.character },
      update: char,
      create: char,
    });
  }
  console.log(`✅ Seeded ${INITIAL_CHARACTERS.length} Chinese characters`);
  
  // 오행 분류 규칙 입력
  for (const rule of ELEMENT_RULES) {
    await prisma.elementRule.create({
      data: rule,
    });
  }
  console.log(`✅ Seeded ${ELEMENT_RULES.length} element rules`);
  
  console.log('🎉 Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });