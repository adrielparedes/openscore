import Image from "next/image";
import redHatReverse from "@/public/Logo-Red_Hat-A-Reverse-RGB.Large-logo-transparent.png";
import redHatStandard from "@/public/Logo-Red_Hat-A-Standard-RGB.Large-logo-(transparent-background).png";

interface OpenScoreLogoProps {
  /** "light" = always white logo, "dark" = always dark logo, "auto" = follows theme */
  variant?: "light" | "dark" | "auto";
  className?: string;
}

export default function OpenScoreLogo({ variant = "auto", className = "" }: OpenScoreLogoProps) {
  if (variant === "auto") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Image
          src={redHatReverse}
          alt="Red Hat"
          className="h-5 w-auto hidden dark:block"
          style={{ objectFit: "contain" }}
          priority
        />
        <Image
          src={redHatStandard}
          alt="Red Hat"
          className="h-5 w-auto block dark:hidden"
          style={{ objectFit: "contain" }}
          priority
        />
        <div className="h-4 border-l border-foreground/30" />
        <span className="font-light text-sm tracking-tight whitespace-nowrap text-foreground">
          Open Score
        </span>
      </div>
    );
  }

  const isLight = variant === "light";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={isLight ? redHatReverse : redHatStandard}
        alt="Red Hat"
        className="h-5 w-auto"
        style={{ objectFit: "contain" }}
        priority
      />
      <div className={`h-4 border-l ${isLight ? "border-white/40" : "border-slate-300"}`} />
      <span className={`font-light text-sm tracking-tight whitespace-nowrap ${isLight ? "text-white" : "text-slate-900"}`}>
        Open Score
      </span>
    </div>
  );
}
