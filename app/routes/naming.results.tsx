import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "~/lib/session.server";
import { NameGenerator } from "~/lib/naming.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const sajuData = session.get("sajuData");
  const nameConfig = session.get("nameConfig");
  const selectedValues = session.get("selectedValues");
  
  if (!sajuData || !nameConfig || !selectedValues) {
    return redirect("/naming/saju");
  }
  
  // 작명 생성
  const generator = new NameGenerator();
  const recommendations = await generator.generateNames({
    saju: sajuData,
    surname: nameConfig.surname,
    nameLength: nameConfig.nameLength,
    fixedChars: nameConfig.fixedChars || {},
    values: selectedValues
  });
  
  return json({ 
    recommendations, 
    sajuData, 
    nameConfig,
    selectedValues 
  });
}

export default function NamingResults() {
  const { recommendations, sajuData, nameConfig } = useLoaderData<typeof loader>();
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* 출생 정보 및 사주 분석 요약 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">사주 분석 결과</h2>
        
        {/* 출생 정보 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">양력:</span> {sajuData.birthInfo.solar}
            </div>
            <div>
              <span className="text-gray-600">음력:</span> {sajuData.birthInfo.lunar}
            </div>
            <div>
              <span className="text-gray-600">띠:</span> {sajuData.birthInfo.zodiac}
            </div>
            <div>
              <span className="text-gray-600">일간:</span> {sajuData.dayMaster}
            </div>
          </div>
        </div>

        {/* 사주팔자 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">사주팔자</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded">
              <div className="text-sm text-gray-600">년주</div>
              <div className="font-bold">{sajuData.year.gan}{sajuData.year.ji}</div>
            </div>
            <div className="p-3 bg-green-50 rounded">
              <div className="text-sm text-gray-600">월주</div>
              <div className="font-bold">{sajuData.month.gan}{sajuData.month.ji}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <div className="text-sm text-gray-600">일주</div>
              <div className="font-bold">{sajuData.day.gan}{sajuData.day.ji}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-sm text-gray-600">시주</div>
              <div className="font-bold">{sajuData.hour.gan}{sajuData.hour.ji}</div>
            </div>
          </div>
        </div>

        {/* 오행 분포 */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">오행 분포</h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(sajuData.elements).map(([element, percentage]) => (
              <div key={element} className="text-center">
                <div className="text-3xl mb-2">{getElementEmoji(element)}</div>
                <div className="font-medium">{element}</div>
                <div className="text-sm text-gray-600">{percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>보완 필요 오행:</strong>{" "}
            <span className="text-blue-700 font-medium">
              {sajuData.yongsin.primary}, {sajuData.yongsin.secondary}
            </span>
          </p>
        </div>
      </div>
      
      {/* 추천 이름 목록 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">추천 이름</h2>
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            조건에 맞는 이름을 찾을 수 없습니다. 설정을 변경해 다시 시도해주세요.
          </div>
        ) : (
          recommendations.map((name, index) => (
            <NameCard 
              key={index} 
              name={name} 
              surname={nameConfig.surname}
              rank={index + 1} 
            />
          ))
        )}
      </div>
      
      <div className="mt-8 text-center">
        <Link
          to="/naming"
          className="inline-block bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          처음부터 다시하기
        </Link>
      </div>
    </div>
  );
}

function NameCard({ name, surname, rank }: any) {
  const fullName = surname + name.name;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">#{rank}</span>
            <h3 className="text-2xl font-bold">{fullName}</h3>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
              종합점수: {name.scores.total}점
            </span>
          </div>
        </div>
      </div>
      
      {/* 한자 상세 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {name.characterInfo.map((char: any, idx: number) => (
          <div key={idx} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{char.character}</span>
              <div className="text-right">
                <div className="text-sm text-gray-600">{char.sound}</div>
                <div className="text-sm font-medium">{char.meaning}</div>
                <div className="text-xs text-gray-500">{char.element}행</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 점수 상세 */}
      <div className="grid grid-cols-5 gap-2 mb-4 text-center">
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">오행</div>
          <div className="font-medium">{name.scores.element}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">음향</div>
          <div className="font-medium">{name.scores.sound}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">의미</div>
          <div className="font-medium">{name.scores.meaning}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">수리</div>
          <div className="font-medium">{name.scores.numerology}</div>
        </div>
        <div className="bg-gray-50 rounded p-2">
          <div className="text-xs text-gray-600">가치</div>
          <div className="font-medium">{name.scores.value}</div>
        </div>
      </div>
      
      {/* 분석 */}
      <div className="space-y-2 text-sm text-gray-600">
        <p>• {name.analysis.elementBalance}</p>
        <p>• {name.analysis.soundHarmony}</p>
        <p>• {name.analysis.meaningCombination}</p>
      </div>
      
      <Link
        to={`/naming/analysis/${rank}`}
        className="mt-4 inline-block text-orange-600 hover:text-orange-700 font-medium"
      >
        상세 분석 보기 →
      </Link>
    </div>
  );
}

function getElementEmoji(element: string): string {
  const emojis: Record<string, string> = {
    목: "🌳",
    화: "🔥",
    토: "🏔️",
    금: "⚡",
    수: "💧"
  };
  return emojis[element] || "❓";
}