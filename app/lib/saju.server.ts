// 사주 계산 로직 (서버 사이드)

export interface SajuData {
  year: { gan: string; ji: string };
  month: { gan: string; ji: string };
  day: { gan: string; ji: string };
  hour: { gan: string; ji: string };
  elements: Record<string, number>;
  yongsin: { primary: string; secondary: string; helpful?: string };
  dayMaster: string;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

// 천간지지 상수
const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const ELEMENT_MAP = {
  천간: {
    갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
    기: '토', 경: '금', 신: '금', 임: '수', 계: '수'
  },
  지지: {
    자: '수', 축: '토', 인: '목', 묘: '목', 진: '토', 사: '화',
    오: '화', 미: '토', 신: '금', 유: '금', 술: '토', 해: '수'
  }
};

const YINYANG_MAP = {
  갑: '양', 을: '음', 병: '양', 정: '음', 무: '양',
  기: '음', 경: '양', 신: '음', 임: '양', 계: '음'
};

export class SajuCalculator {
  // 사주 계산 메인 함수
  async calculateSaju(birthDate: Date, gender: 'M' | 'F'): Promise<SajuData> {
    // 1. 년주 계산
    const yearPillar = this.calculateYearPillar(birthDate);
    
    // 2. 월주 계산
    const monthPillar = this.calculateMonthPillar(birthDate, yearPillar.gan);
    
    // 3. 일주 계산 (만세력)
    const dayPillar = this.calculateDayPillar(birthDate);
    
    // 4. 시주 계산
    const hourPillar = this.calculateHourPillar(birthDate.getHours(), dayPillar.gan);
    
    // 5. 오행 분석
    const elements = this.analyzeElements([
      yearPillar, monthPillar, dayPillar, hourPillar
    ]);
    
    // 6. 용신 추출
    const yongsin = this.findYongsin(elements, dayPillar.gan);
    
    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
      elements,
      yongsin,
      dayMaster: dayPillar.gan
    };
  }

  // 년주 계산 (입춘 기준)
  private calculateYearPillar(date: Date): { gan: string; ji: string } {
    let year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 입춘 전이면 전년으로 계산 (대략 2월 4일 기준)
    if (month === 1 || (month === 2 && day < 4)) {
      year -= 1;
    }
    
    // 1984년 갑자년 기준
    const diff = year - 1984;
    const ganIdx = ((diff % 10) + 10) % 10;
    const jiIdx = ((diff % 12) + 12) % 12;
    
    return {
      gan: CHEONGAN[ganIdx],
      ji: JIJI[jiIdx]
    };
  }

  // 월주 계산 (절기 기준)
  private calculateMonthPillar(date: Date, yearGan: string): { gan: string; ji: string } {
    // 절기별 월지 매핑 (간단한 버전)
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    let monthJi: string;
    if ((month === 2 && day >= 4) || (month === 3 && day < 6)) monthJi = '인';
    else if ((month === 3 && day >= 6) || (month === 4 && day < 5)) monthJi = '묘';
    else if ((month === 4 && day >= 5) || (month === 5 && day < 6)) monthJi = '진';
    else if ((month === 5 && day >= 6) || (month === 6 && day < 6)) monthJi = '사';
    else if ((month === 6 && day >= 6) || (month === 7 && day < 7)) monthJi = '오';
    else if ((month === 7 && day >= 7) || (month === 8 && day < 8)) monthJi = '미';
    else if ((month === 8 && day >= 8) || (month === 9 && day < 8)) monthJi = '신';
    else if ((month === 9 && day >= 8) || (month === 10 && day < 8)) monthJi = '유';
    else if ((month === 10 && day >= 8) || (month === 11 && day < 7)) monthJi = '술';
    else if ((month === 11 && day >= 7) || (month === 12 && day < 7)) monthJi = '해';
    else if ((month === 12 && day >= 7) || (month === 1 && day < 6)) monthJi = '자';
    else monthJi = '축';
    
    // 월간 계산 (오호둔법)
    const monthGan = this.calculateMonthGan(yearGan, monthJi);
    
    return { gan: monthGan, ji: monthJi };
  }

  // 월간 계산 (년간에 따른 월간)
  private calculateMonthGan(yearGan: string, monthJi: string): string {
    const monthGanStart: Record<string, string> = {
      '갑': '병', '기': '병',  // 갑기지년 병인월
      '을': '무', '경': '무',  // 을경지년 무인월  
      '병': '경', '신': '경',  // 병신지년 경인월
      '정': '임', '임': '임',  // 정임지년 임인월
      '무': '갑', '계': '갑'   // 무계지년 갑인월
    };
    
    const jiList = ['인', '묘', '진', '사', '오', '미', '신', '유', '술', '해', '자', '축'];
    const startGan = monthGanStart[yearGan];
    const startIdx = CHEONGAN.indexOf(startGan);
    const monthIdx = jiList.indexOf(monthJi);
    
    const finalGanIdx = (startIdx + monthIdx) % 10;
    return CHEONGAN[finalGanIdx];
  }

  // 일주 계산 (만세력)
  private calculateDayPillar(date: Date): { gan: string; ji: string } {
    // 기준일: 1900년 1월 1일 = 갑진일
    const baseDate = new Date(1900, 0, 1);
    const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const ganIndex = daysDiff % 10;
    const jiIndex = (daysDiff + 4) % 12; // 진(辰)이 인덱스 4
    
    return {
      gan: CHEONGAN[ganIndex],
      ji: JIJI[jiIndex]
    };
  }

  // 시주 계산
  private calculateHourPillar(hour: number, dayGan: string): { gan: string; ji: string } {
    // 시간별 지지 매핑
    let hourJi: string;
    if (hour === 23 || hour === 0) hourJi = '자';
    else if (hour === 1 || hour === 2) hourJi = '축';
    else if (hour === 3 || hour === 4) hourJi = '인';
    else if (hour === 5 || hour === 6) hourJi = '묘';
    else if (hour === 7 || hour === 8) hourJi = '진';
    else if (hour === 9 || hour === 10) hourJi = '사';
    else if (hour === 11 || hour === 12) hourJi = '오';
    else if (hour === 13 || hour === 14) hourJi = '미';
    else if (hour === 15 || hour === 16) hourJi = '신';
    else if (hour === 17 || hour === 18) hourJi = '유';
    else if (hour === 19 || hour === 20) hourJi = '술';
    else hourJi = '해';
    
    // 시간 계산
    const hourGan = this.calculateHourGan(dayGan, hourJi);
    
    return { gan: hourGan, ji: hourJi };
  }

  // 시간 계산
  private calculateHourGan(dayGan: string, hourJi: string): string {
    const hourGanMap: Record<string, string> = {
      '갑': '갑', '기': '갑',  // 갑기일 갑자시
      '을': '병', '경': '병',  // 을경일 병자시
      '병': '무', '신': '무',  // 병신일 무자시
      '정': '경', '임': '경',  // 정임일 경자시
      '무': '임', '계': '임'   // 무계일 임자시
    };
    
    const jiList = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    const startGan = hourGanMap[dayGan];
    const startIdx = CHEONGAN.indexOf(startGan);
    const hourIdx = jiList.indexOf(hourJi);
    
    const finalGanIdx = (startIdx + hourIdx) % 10;
    return CHEONGAN[finalGanIdx];
  }

  // 오행 분석
  private analyzeElements(pillars: Array<{gan: string; ji: string}>): Record<string, number> {
    const elements = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    
    pillars.forEach(pillar => {
      const ganElement = ELEMENT_MAP.천간[pillar.gan];
      const jiElement = ELEMENT_MAP.지지[pillar.ji];
      
      if (ganElement) elements[ganElement]++;
      if (jiElement) elements[jiElement]++;
    });
    
    // 백분율로 변환
    const total = Object.values(elements).reduce((a, b) => a + b, 0);
    Object.keys(elements).forEach(key => {
      elements[key] = Math.round((elements[key] / total) * 100);
    });
    
    return elements;
  }

  // 용신 찾기
  private findYongsin(elements: Record<string, number>, dayGan: string): { primary: string; secondary: string; helpful?: string } {
    // 일간의 오행
    const dayElement = ELEMENT_MAP.천간[dayGan];
    
    // 가장 부족한 오행 2개 추출
    const sorted = Object.entries(elements).sort((a, b) => a[1] - b[1]);
    const yongsin = sorted.slice(0, 2).map(item => item[0]);
    
    // 상생 관계
    const sangseang: Record<string, string> = {
      '목': '화', '화': '토', '토': '금', '금': '수', '수': '목'
    };
    
    return {
      primary: yongsin[0],
      secondary: yongsin[1],
      helpful: sangseang[dayElement]
    };
  }
}