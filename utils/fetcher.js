import fetch from "isomorphic-unfetch"

export const fetcher = baseUrl => async (url, args) => {
  try {
    const result = await fetch(`${baseUrl}${url}`, {
      ...args,
      headers: {
        "Content-Type": "application/json",
        ...(args?.headers || {})
      },
      body:
        typeof args?.body === "object" ? JSON.stringify(args?.body) : args?.body
    })

    if (args?.toBlob) {
      return {
        ok: result.ok,
        status: result.status,
        blob: await result.blob()
      }
    }

    if (args?.toText) {
      return {
        ok: result.ok,
        status: result.status,
        text: await result.text()
      }
    }

    return {
      ok: result.ok,
      status: result.status,
      json:
        result.headers.get("Content-Type")?.indexOf("application/json") >= 0
          ? await result.json()
          : null
    }
  } catch (err) {
    console.error(err)
    return { success: false, status: 500, json: err }
  }
}

export const encodeQuery = (url, args = {}) => {
  const params = Object.entries(args)
    .filter(([_, value]) => Boolean(value))
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )

  if (params.length > 0) {
    return `${url}?${params.join("&")}`
  }
  return url
}
