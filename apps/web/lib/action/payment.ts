const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const checkoutverify = async (sessionId: string) => {
  const response = await fetch(`${BASE_URL}/payment/checkout_verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionid: sessionId }),
  })

  // Never call response.json() blindly — a 404/500 from Express is HTML,
  // which produced the confusing "Unexpected token '<'" error.
  const contentType = response.headers.get("content-type") ?? ""
  if (!response.ok || !contentType.includes("application/json")) {
    const text = await response.text().catch(() => "")
    throw new Error(
      `Payment verification failed (${response.status}): ${text.slice(0, 200)}`
    )
  }

  return response.json()
}
