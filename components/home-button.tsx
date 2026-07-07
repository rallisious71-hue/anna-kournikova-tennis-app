import { Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export interface HomeButtonProps {
  /** Override the full className of the touchable (use for custom themed headers). */
  className?: string;
  /** "default" matches the neutral surface/border style used on most screens.
   *  "retro" matches the bold yellow retro style used on Home/Settings headers. */
  variant?: "default" | "retro";
  /** Text/emoji size class for the icon. */
  iconClassName?: string;
}

/**
 * Home button used across all screens to let the user jump straight back
 * to the home screen, regardless of how deep they navigated.
 */
export function HomeButton({ className, variant = "default", iconClassName }: HomeButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    // Prefer dismissing back to an existing "/" entry in the stack (keeps history clean);
    // fall back to a plain replace if there is nothing to dismiss to.
    try {
      router.dismissTo("/");
    } catch {
      router.replace("/");
    }
  };

  const defaultClassName =
    variant === "retro"
      ? "w-12 h-12 rounded-lg bg-yellow-300 border-2 border-yellow-400 items-center justify-center active:scale-95"
      : "w-10 h-10 rounded-full bg-surface border border-border items-center justify-center active:opacity-80";

  const textClassName =
    iconClassName ?? (variant === "retro" ? "text-black text-xl" : "text-foreground text-lg");

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={className ?? defaultClassName}
      accessibilityRole="button"
      accessibilityLabel="Αρχική σελίδα"
    >
      <Text className={textClassName}>🏠</Text>
    </TouchableOpacity>
  );
}
