import {
  BrainCircuit,
  Code2,
  Gift,
  Globe2,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Palette,
  Phone,
  Plug,
  Rocket,
  Search,
  Server,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Store,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  BrainCircuit,
  Code2,
  Gift,
  Globe2,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Palette,
  Phone,
  Plug,
  Rocket,
  Search,
  Server,
  ShoppingCart,
  Smartphone,
  Store,
  UtensilsCrossed,
  Wrench,
};

export function resolveIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}
