import Stripe from "stripe";
import { checkoutConfiguration } from "@/lib/education-checkout.mjs";

export function educationStripe() {
  const config = checkoutConfiguration(process.env);
  if (!config) return null;
  return { config, stripe: new Stripe(config.secretKey, { maxNetworkRetries: 2, timeout: 10_000 }) };
}
