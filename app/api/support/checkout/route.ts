import { educationStripe } from "@/lib/education-stripe";
import { checkoutParameters, isStripeCheckoutUrl, readCheckoutBody, validateSupportRequest } from "@/lib/education-checkout.mjs";

export const runtime = "nodejs";

function response(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const setup = educationStripe();
  if (!setup) return response({ error: "Payments are not available yet." }, 503);
  if (request.headers.get("origin") !== setup.config.origin) return response({ error: "Invalid checkout origin." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return response({ error: "Send a JSON support request." }, 415);
  let support;
  try { support = validateSupportRequest(await readCheckoutBody(request)); }
  catch (error) { return response({ error: error instanceof SyntaxError ? "Invalid support request." : error instanceof Error ? error.message : "Invalid support request." }, 400); }
  try {
    const session = await setup.stripe.checkout.sessions.create(checkoutParameters(support, setup.config), { idempotencyKey: `education:${support.attemptId}` });
    if (session.livemode || !isStripeCheckoutUrl(session.url)) return response({ error: "Checkout is unavailable. Please try again later." }, 502);
    return response({ url: session.url });
  } catch (error) {
    // Do not log or return Stripe request payloads, contact details, or secrets.
    if (error instanceof Error && "type" in error && error.type === "StripeIdempotencyError") return response({ error: "This checkout attempt changed. Start a new attempt." }, 409);
    return response({ error: "Could not open checkout. Please try again." }, 502);
  }
}
