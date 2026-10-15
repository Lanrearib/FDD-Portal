import type { Metadata } from "next";
import { CentralOverview } from "./central-overview";

export const metadata: Metadata = { title: "Central office" };

export default function CentralPage() {
  return <CentralOverview />;
}
