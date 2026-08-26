import { LocaleShell } from "@/components/layout/LocaleShell";
import { HomeSections } from "@/components/sections/HomeSections";

export default function HomePage() {
  return (
    <LocaleShell locale="en">
      <HomeSections />
    </LocaleShell>
  );
}
