export default async function SSRInternalTest() {
  // K8s 내부 서비스 주소 (예: backend-service가 8080 포트인 경우)
  // 같은 네임스페이스라면 http://backend-service:8080
  const BACKEND_URL = process.env.INTERNAL_BACKEND_URL;

  let data = { message: "data not found" };
  let status = "failed";

  try {
    const res = await fetch(`${BACKEND_URL}/now`, {
      cache: "no-store",
      // K8s 내부 통신이므로 타임아웃을 짧게 잡는 것이 좋습니다.
      next: { revalidate: 0 },
    });

    if (res.ok) {
      data = { message: await res.text() };
      status = "success";
    }
  } catch (error) {
    console.error("Internal Fetch Error:", error);
    status = `error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>K8s Internal SSR Test</h2>
      <p>
        <strong>접속 시도 주소:</strong> {BACKEND_URL}
      </p>
      <p>
        <strong>통신 상태:</strong> {status}
      </p>
      <hr />
      <p>
        <strong>백엔드 수신 데이터:</strong>
      </p>
      <pre style={{ background: "#f4f4f4", padding: "10px" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
