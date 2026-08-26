import { LocaleShell } from "@/components/layout/LocaleShell";
import { HomeSections } from "@/components/sections/HomeSections";

// Metadata comes from the (ar) layout. Declaring it here too made the layout's title
// template wrap the page title, shipping "إنجاز — … | إنجاز".
export default function ArabicHomePage() {
  return (
    <LocaleShell locale="ar">
      <HomeSections />
    </LocaleShell>
  );
}
