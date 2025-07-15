import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getSession, commitSession } from "~/lib/session.server";

const VALUES = [
  { id: "wealth", label: "재물운", emoji: "💰" },
  { id: "health", label: "건강운", emoji: "💪" },
  { id: "wisdom", label: "지혜", emoji: "📚" },
  { id: "leadership", label: "리더십", emoji: "👑" },
  { id: "creativity", label: "창의성", emoji: "🎨" },
  { id: "harmony", label: "대인관계", emoji: "🤝" },
  { id: "success", label: "성공운", emoji: "🏆" },
  { id: "fame", label: "명예", emoji: "⭐" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const sajuData = session.get("sajuData");
  const nameConfig = session.get("nameConfig");
  
  if (!sajuData || !nameConfig) {
    return redirect("/naming/saju");
  }
  
  return json({ sajuData, nameConfig });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const values = formData.getAll("values") as string[];

  if (values.length === 0) {
    return json({ error: "최소 1개 이상의 가치를 선택해주세요" }, { status: 400 });
  }

  const session = await getSession(request);
  session.set("selectedValues", values);

  return redirect("/naming/results", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SelectValues() {
  const { nameConfig } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          중요하게 생각하는 가치 선택
        </h3>
        <p className="text-gray-600 mb-6">
          아이에게 바라는 가치를 선택해주세요 (복수 선택 가능)
        </p>

        <Form method="post">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {VALUES.map((value) => (
              <label
                key={value.id}
                className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  name="values"
                  value={value.id}
                  className="mr-3"
                />
                <span className="text-2xl mr-2">{value.emoji}</span>
                <span className="font-medium">{value.label}</span>
              </label>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded mb-6">
            <p className="text-sm text-gray-600">
              <strong>설정된 정보:</strong> {nameConfig.surname}씨, {nameConfig.nameLength}글자 이름
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            이름 추천받기
          </button>
        </Form>
      </div>
    </div>
  );
}