export async function onRequestGet({ env }) {
  if (!env.CARTO_API_KEY) {
    return Response.json({ error: "CARTO 키가 서버에 설정되지 않았습니다." }, { status: 503 });
  }
  // CARTO basemap keys are browser-visible web keys; restrict the key to the deployed host.
  return Response.json({ cartoKey: env.CARTO_API_KEY }, {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" }
  });
}

