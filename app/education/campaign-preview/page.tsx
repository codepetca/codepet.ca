import type { Metadata } from "next";
import { CampaignPreview } from "@/components/campaign-preview";

export const metadata: Metadata = {
  title: "Game Jam · Campaign Preview",
  description: "An illustrative preview of a Codepet Education event campaign.",
  robots: { index: false, follow: false },
};

export default function CampaignPreviewPage() {
  return <CampaignPreview />;
}
