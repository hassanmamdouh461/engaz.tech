import rawContent from "@/data/content.json";
import type { SiteContent } from "./types";

export const content = rawContent as unknown as SiteContent;
