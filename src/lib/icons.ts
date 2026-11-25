import BrainCircuit from "@lucide/astro/icons/brain-circuit";
import CodeXml from "@lucide/astro/icons/code-xml";
import Gift from "@lucide/astro/icons/gift";
import Globe from "@lucide/astro/icons/globe";
import LayoutDashboard from "@lucide/astro/icons/layout-dashboard";
import Mail from "@lucide/astro/icons/mail";
import MessageCircle from "@lucide/astro/icons/message-circle";
import MessageSquare from "@lucide/astro/icons/message-square";
import Palette from "@lucide/astro/icons/palette";
import Phone from "@lucide/astro/icons/phone";
import Plug from "@lucide/astro/icons/plug";
import Rocket from "@lucide/astro/icons/rocket";
import Server from "@lucide/astro/icons/server";
import ShoppingCart from "@lucide/astro/icons/shopping-cart";
import Smartphone from "@lucide/astro/icons/smartphone";
import Sparkles from "@lucide/astro/icons/sparkles";
import Store from "@lucide/astro/icons/store";
import UtensilsCrossed from "@lucide/astro/icons/utensils-crossed";
import Wrench from "@lucide/astro/icons/wrench";

/**
 * content.json names icons by their Lucide names. Each icon is imported from its
 * own module so only the icons in this registry reach the build. Unknown names
 * fall back to Sparkles — add new imports here when introducing an icon.
 */
const registry = {
  BrainCircuit,
  Code2: CodeXml,
  Gift,
  Globe2: Globe,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Palette,
  Phone,
  Plug,
  Rocket,
  Server,
  ShoppingCart,
  Smartphone,
  Store,
  UtensilsCrossed,
  WhatsApp: MessageCircle,
  Wrench,
};

export type IconComponent = typeof Sparkles;

export function resolveIcon(name: string): IconComponent {
  return (registry as Record<string, IconComponent>)[name] ?? Sparkles;
}
