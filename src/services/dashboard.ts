import { getDashboardSummary } from "@/services/transactions";

export async function getSummary() {
  return getDashboardSummary();
}
