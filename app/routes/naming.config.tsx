import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const sajuData = session.get("sajuData");
  
  if (!sajuData) {
    return redirect("/naming/saju");
  }
  
  return json({ sajuData });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const surname = formData.get("surname") as string;
  const nameLength = formData.get("nameLength") as string;
  const fixedChar1 = formData.get("fixedChar1") as string;
  const fixedChar2 = formData.get("fixedChar2") as string;

  const session = await getSession(request.headers.get("Cookie"));
  session.set("nameConfig", {
    surname,
    nameLength: parseInt(nameLength),
    fixedChars: {
      ...(fixedChar1 && { 0: fixedChar1 }),
      ...(fixedChar2 && { 1: fixedChar2 })
    }
  });

  return redirect("/naming/values", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function NameConfig() {
  const { sajuData } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto">
      {/* 사주 분석 결과 요약 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">사주 분석 결과</h3>
        <div className="grid grid-cols-5 gap-4 mb-4">
          {Object.entries(sajuData.elements).map(([element, percentage]) => (
            <div key={element} className="text-center">
              <div className="text-2xl mb-1">{getElementEmoji(element)}</div>
              <div className="font-medium">{element}</div>
              <div className="text-sm text-gray-600">{percentage}%</div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-blue-50 rounded">
          <p className="text-sm">
            <strong>보완 필요 오행:</strong>{" "}
            <span className="text-blue-700">{sajuData.yongsin.primary}</span>,{" "}
            <span className="text-blue-700">{sajuData.yongsin.secondary}</span>
          </p>
        </div>
      </div>

      {/* 이름 설정 폼 */}
      <Form method="post" className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">이름 설정</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              성씨
            </label>
            <input
              type="text"
              name="surname"
              required
              maxLength={1}
              placeholder="김"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              이름 글자 수
            </label>
            <select
              name="nameLength"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="1">1글자</option>
              <option value="2" selected>2글자</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              고정 글자 (선택사항)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="fixedChar1"
                maxLength={1}
                placeholder="첫 번째 글자"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="text"
                name="fixedChar2"
                maxLength={1}
                placeholder="두 번째 글자"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            다음 단계
          </button>
        </div>
      </Form>
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