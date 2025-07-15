import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { SajuCalculator } from "~/lib/saju.server";
import { getSession, commitSession } from "~/lib/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const birthDate = formData.get("birthDate") as string;
  const birthHour = formData.get("birthHour") as string;
  const gender = formData.get("gender") as "M" | "F";

  if (!birthDate || !gender) {
    return json({ error: "생년월일과 성별을 입력해주세요" }, { status: 400 });
  }

  // 날짜 및 시간 파싱
  const date = new Date(birthDate);
  if (birthHour) {
    date.setHours(parseInt(birthHour));
  }

  // 사주 계산
  const calculator = new SajuCalculator();
  const sajuData = await calculator.calculateSaju(date, gender);

  // 세션에 저장
  const session = await getSession(request);
  session.set("sajuData", sajuData);
  session.set("birthInfo", { date: birthDate, hour: birthHour, gender });

  return redirect("/naming/config", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SajuInput() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        생년월일시 입력
      </h2>
      
      <Form method="post" className="space-y-6 bg-white p-6 rounded-lg shadow">
        {actionData?.error && (
          <div className="text-red-600 text-sm">{actionData.error}</div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-2">
            생년월일
          </label>
          <input
            type="date"
            name="birthDate"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            출생 시간
          </label>
          <select
            name="birthHour"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">모름</option>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, '0')}시
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            성별
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="M" 
                required 
                className="mr-2"
              />
              <span>남성</span>
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="gender" 
                value="F" 
                required 
                className="mr-2"
              />
              <span>여성</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
        >
          사주 분석하기
        </button>
      </Form>
    </div>
  );
}