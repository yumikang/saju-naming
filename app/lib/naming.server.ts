import { prisma } from "./db.server";
import type { SajuData } from "./saju.server";
import type { ChineseCharacter } from "@prisma/client";

export interface NameGenerationOptions {
  saju: SajuData;
  surname: string;
  nameLength: number;
  fixedChars: Record<number, string>;
  values: string[];
}

export interface NameRecommendation {
  name: string;
  characters: string[];
  characterInfo: Array<{
    character: string;
    meaning: string;
    element: string;
    sound: string;
  }>;
  scores: {
    element: number;
    sound: number;
    meaning: number;
    numerology: number;
    value: number;
    total: number;
  };
  analysis: {
    elementBalance: string;
    soundHarmony: string;
    meaningCombination: string;
  };
}

export class NameGenerator {
  async generateNames(options: NameGenerationOptions): Promise<NameRecommendation[]> {
    const { saju, surname, nameLength, fixedChars, values } = options;
    
    // 1. 용신에 맞는 한자 검색
    const candidates = await this.findCharactersByElement(
      saju.yongsin.primary,
      saju.yongsin.secondary
    );
    
    // 2. 가치관에 맞는 한자 필터링
    const filteredCandidates = await this.filterByValues(candidates, values);
    
    // 3. 조합 생성
    const combinations = this.createCombinations(
      filteredCandidates,
      nameLength,
      fixedChars
    );
    
    // 4. 평가 및 정렬
    const evaluated = await Promise.all(
      combinations.map(combo => this.evaluateName(surname, combo, saju, values))
    );
    
    // 5. 상위 10개 반환
    return evaluated
      .sort((a, b) => b.scores.total - a.scores.total)
      .slice(0, 10);
  }
  
  private async findCharactersByElement(primary: string, secondary: string): Promise<ChineseCharacter[]> {
    return prisma.chineseCharacter.findMany({
      where: {
        OR: [
          { primaryElement: primary },
          { primaryElement: secondary }
        ],
        nameSuitability: { gte: 70 },
        isActive: true
      },
      orderBy: [
        { nameSuitability: 'desc' },
        { usageCount: 'desc' }
      ],
      take: 200
    });
  }
  
  private async filterByValues(
    characters: ChineseCharacter[], 
    values: string[]
  ): Promise<ChineseCharacter[]> {
    // 가치관에 따른 의미 카테고리 매핑
    const valueCategoryMap: Record<string, string[]> = {
      wealth: ['재물', '풍요', '번영'],
      health: ['건강', '장수', '활력'],
      wisdom: ['지혜', '학문', '총명'],
      leadership: ['리더십', '통솔', '권위'],
      creativity: ['창의', '예술', '재능'],
      harmony: ['화합', '인연', '배려'],
      success: ['성공', '성취', '발전'],
      fame: ['명예', '명성', '영광']
    };
    
    const relevantCategories = values.flatMap(v => valueCategoryMap[v] || []);
    
    if (relevantCategories.length === 0) {
      return characters;
    }
    
    // 관련 카테고리가 있는 한자 우선
    return characters.sort((a, b) => {
      const aRelevant = relevantCategories.some(cat => 
        a.meaningCategory?.includes(cat) || a.positiveMeaning?.includes(cat)
      );
      const bRelevant = relevantCategories.some(cat => 
        b.meaningCategory?.includes(cat) || b.positiveMeaning?.includes(cat)
      );
      
      if (aRelevant && !bRelevant) return -1;
      if (!aRelevant && bRelevant) return 1;
      return 0;
    });
  }
  
  private createCombinations(
    characters: ChineseCharacter[],
    length: number,
    fixed: Record<number, string>
  ): string[][] {
    const combinations: string[][] = [];
    
    if (length === 1) {
      // 1글자 이름
      for (const char of characters) {
        if (fixed[0] && fixed[0] !== char.character) continue;
        combinations.push([char.character]);
      }
    } else if (length === 2) {
      // 2글자 이름
      for (const char1 of characters) {
        if (fixed[0] && fixed[0] !== char1.character) continue;
        
        for (const char2 of characters) {
          if (fixed[1] && fixed[1] !== char2.character) continue;
          if (char1.character === char2.character) continue;
          
          combinations.push([char1.character, char2.character]);
          
          if (combinations.length >= 200) break;
        }
        if (combinations.length >= 200) break;
      }
    }
    
    return combinations;
  }
  
  private async evaluateName(
    surname: string,
    chars: string[],
    saju: SajuData,
    values: string[]
  ): Promise<NameRecommendation> {
    // 한자 정보 조회
    const characterInfo = await prisma.chineseCharacter.findMany({
      where: {
        character: { in: chars }
      }
    });
    
    const charMap = new Map(characterInfo.map(c => [c.character, c]));
    
    // 점수 계산
    const scores = {
      element: this.calculateElementScore(surname, chars, charMap, saju),
      sound: this.calculateSoundScore(surname, chars, charMap),
      meaning: this.calculateMeaningScore(chars, charMap),
      numerology: this.calculateNumerologyScore(surname, chars, charMap),
      value: this.calculateValueScore(chars, charMap, values)
    };
    
    scores.total = Math.round(
      scores.element * 0.3 +
      scores.sound * 0.2 +
      scores.meaning * 0.2 +
      scores.numerology * 0.2 +
      scores.value * 0.1
    );
    
    // 분석 생성
    const analysis = this.generateAnalysis(surname, chars, charMap, saju);
    
    return {
      name: chars.join(''),
      characters: chars,
      characterInfo: chars.map(char => {
        const info = charMap.get(char)!;
        return {
          character: char,
          meaning: info.koreanMeaning,
          element: info.primaryElement,
          sound: info.koreanSound
        };
      }),
      scores,
      analysis
    };
  }
  
  private calculateElementScore(
    surname: string,
    chars: string[],
    charMap: Map<string, ChineseCharacter>,
    saju: SajuData
  ): number {
    let score = 50;
    
    // 용신 보완 체크
    chars.forEach(char => {
      const charInfo = charMap.get(char);
      if (!charInfo) return;
      
      if (charInfo.primaryElement === saju.yongsin.primary) {
        score += 25;
      } else if (charInfo.primaryElement === saju.yongsin.secondary) {
        score += 15;
      }
    });
    
    // 상생 관계 체크
    const elements = chars.map(c => charMap.get(c)?.primaryElement).filter(Boolean);
    if (this.checkSangSeang(elements)) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }
  
  private calculateSoundScore(
    surname: string,
    chars: string[],
    charMap: Map<string, ChineseCharacter>
  ): number {
    let score = 80;
    
    // 발음 조화 체크
    const sounds = [surname, ...chars.map(c => charMap.get(c)?.koreanSound)].filter(Boolean);
    
    // 같은 발음 반복 감점
    const soundSet = new Set(sounds);
    if (soundSet.size < sounds.length) {
      score -= 20;
    }
    
    // 발음하기 어려운 조합 감점
    const difficultCombos = ['ㅈㅈ', 'ㅊㅊ', 'ㅅㅅ'];
    const combined = sounds.join('');
    difficultCombos.forEach(combo => {
      if (combined.includes(combo)) {
        score -= 10;
      }
    });
    
    return Math.max(score, 0);
  }
  
  private calculateMeaningScore(
    chars: string[],
    charMap: Map<string, ChineseCharacter>
  ): number {
    let score = 70;
    
    // 긍정적 의미 가산점
    chars.forEach(char => {
      const charInfo = charMap.get(char);
      if (charInfo?.positiveMeaning) {
        score += 15;
      }
    });
    
    return Math.min(score, 100);
  }
  
  private calculateNumerologyScore(
    surname: string,
    chars: string[],
    charMap: Map<string, ChineseCharacter>
  ): number {
    // 총 획수 계산
    const totalStrokes = chars.reduce((sum, char) => {
      const charInfo = charMap.get(char);
      return sum + (charInfo?.strokeCount || 0);
    }, 0);
    
    // 81수리 길흉
    const luckyNumbers = new Set([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81]);
    
    const number = totalStrokes % 81 || 81;
    return luckyNumbers.has(number) ? 90 : 60;
  }
  
  private calculateValueScore(
    chars: string[],
    charMap: Map<string, ChineseCharacter>,
    values: string[]
  ): number {
    if (values.length === 0) return 70;
    
    let score = 50;
    const valueCategoryMap: Record<string, string[]> = {
      wealth: ['재물', '풍요', '번영'],
      health: ['건강', '장수', '활력'],
      wisdom: ['지혜', '학문', '총명'],
      leadership: ['리더십', '통솔', '권위'],
      creativity: ['창의', '예술', '재능'],
      harmony: ['화합', '인연', '배려'],
      success: ['성공', '성취', '발전'],
      fame: ['명예', '명성', '영광']
    };
    
    const relevantCategories = values.flatMap(v => valueCategoryMap[v] || []);
    
    chars.forEach(char => {
      const charInfo = charMap.get(char);
      if (!charInfo) return;
      
      const hasRelevantMeaning = relevantCategories.some(cat => 
        charInfo.meaningCategory?.includes(cat) || 
        charInfo.positiveMeaning?.includes(cat) ||
        charInfo.koreanMeaning?.includes(cat)
      );
      
      if (hasRelevantMeaning) {
        score += 25;
      }
    });
    
    return Math.min(score, 100);
  }
  
  private checkSangSeang(elements: string[]): boolean {
    const sangSeang: Record<string, string> = {
      '목': '화', '화': '토', '토': '금', '금': '수', '수': '목'
    };
    
    for (let i = 0; i < elements.length - 1; i++) {
      if (sangSeang[elements[i]] === elements[i + 1]) {
        return true;
      }
    }
    
    return false;
  }
  
  private generateAnalysis(
    surname: string,
    chars: string[],
    charMap: Map<string, ChineseCharacter>,
    saju: SajuData
  ): NameRecommendation['analysis'] {
    const elements = chars.map(c => charMap.get(c)?.primaryElement).filter(Boolean);
    
    return {
      elementBalance: `${saju.yongsin.primary}과 ${saju.yongsin.secondary} 오행을 보완하여 균형을 맞춥니다.`,
      soundHarmony: `${surname}씨와 조화로운 발음으로 부르기 쉽고 듣기 좋습니다.`,
      meaningCombination: chars.map(c => charMap.get(c)?.koreanMeaning).join(', ') + '의 의미가 조화를 이룹니다.'
    };
  }
}