import Image from "next/image";
import redHatReverse from "@/public/Logo-Red_Hat-A-Reverse-RGB.Large-logo-transparent.png";
import redHatStandard from "@/public/Logo-Red_Hat-A-Standard-RGB.Large-logo-(transparent-background).png";

interface OpenScoreLogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function OpenScoreLogo({ variant = "light", className = "" }: OpenScoreLogoProps) {
  const textColor = variant === "light" ? "text-white" : "text-slate-900";
  const dividerColor = variant === "light" ? "border-white/40" : "border-slate-300";
  const logo = variant === "light" ? redHatReverse : redHatStandard;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={logo}
        alt="Red Hat"
        className="h-5 w-auto"
        style={{ objectFit: "contain" }}
        priority
      />
      <div className={`h-4 border-l ${dividerColor}`} />
      <span className={`font-light text-sm tracking-tight whitespace-nowrap ${textColor}`}>
        Open Score
      </span>
    </div>
  );
}
