import { Link } from "@remix-run/react";

export default function NamingIndex() {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-semibold mb-4">
        아이의 미래를 밝히는 이름을 찾아드립니다
      </h2>
      <p className="text-gray-600 mb-8">
        사주팔자를 분석하여 부족한 오행을 보완하는 최적의 이름을 추천해드립니다
      </p>
      <Link
        to="/naming/saju"
        className="inline-block bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
      >
        작명 시작하기
      </Link>
    </div>
  );
}