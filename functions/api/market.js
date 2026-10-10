const SERVICES = { rent: "tbLnOpendataRentV", sale: "tbLnOpendataRtmsV" };

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") === "sale" ? "sale" : "rent";
  const year = url.searchParams.get("year");
  const district = url.searchParams.get("district");
  if (year && !/^20\d{2}$/.test(year)) return json({ error: "잘못된 연도입니다." }, 400);
  if (district && !/^\d{5}$/.test(district)) return json({ error: "잘못된 자치구 코드입니다." }, 400);
  if (!env.SEOUL_API_KEY) return json({ error: "서버에 서울시 API 키가 설정되지 않았습니다." }, 503);

  // Seoul's dataset API puts its key in the URL path, so it is called only here.
  const parts = [
    "https://openapi.seoul.go.kr:8088",
    encodeURIComponent(env.SEOUL_API_KEY),
    "json", SERVICES[type], "1", "1000",
    year || "", district || ""
  ];
  const upstream = await fetch(parts.join("/"), { headers: { Accept: "application/json" } });
  if (!upstream.ok) return json({ error: "서울시 데이터 조회에 실패했습니다." }, 502);
  const body = await upstream.json();
  const service = body[SERVICES[type]];
  if (!service) return json({ error: body.RESULT?.MESSAGE || "서울시 API 응답에 자료가 없습니다." }, 502);
  return json({ type, rows: service.row || [], total: service.list_total_count || 0, fetchedAt: new Date().toISOString() }, 200, {
    "Cache-Control": "public, max-age=300, s-maxage=3600"
  });
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...headers } });
}

