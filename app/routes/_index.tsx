import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "사주 작명 서비스 - 아이의 미래를 밝히는 이름" },
    { name: "description", content: "사주팔자를 분석하여 부족한 오행을 보완하는 최적의 이름을 추천해드립니다" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            사주로 찾는 완벽한 이름
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            아이의 사주팔자를 분석하여 부족한 오행을 보완하는<br />
            최적의 이름을 추천해드립니다
          </p>
          <Link
            to="/naming"
            className="inline-block bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-orange-600 transition"
          >
            작명 시작하기
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🔮</div>
            <h3 className="text-xl font-semibold mb-2">정확한 사주 분석</h3>
            <p className="text-gray-600">
              생년월일시를 바탕으로 천간지지와 오행을 정확하게 계산합니다
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">풍부한 한자 데이터</h3>
            <p className="text-gray-600">
              의미, 획수, 오행이 분류된 수천 개의 한자 데이터베이스
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2">맞춤형 추천</h3>
            <p className="text-gray-600">
              부모님이 원하는 가치관을 반영한 최적의 이름을 추천합니다
            </p>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center mb-8">작명 과정</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">생년월일시 입력</h4>
              <p className="text-sm text-gray-600">아이의 출생 정보 입력</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">사주 분석</h4>
              <p className="text-sm text-gray-600">오행 분포와 용신 파악</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">가치관 선택</h4>
              <p className="text-sm text-gray-600">중요하게 생각하는 가치 선택</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">이름 추천</h4>
              <p className="text-sm text-gray-600">맞춤형 이름 목록 제공</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}