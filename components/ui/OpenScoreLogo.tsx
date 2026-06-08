import Image from "next/image";
import redHatReverse from "@/public/Logo-Red_Hat-A-Reverse-RGB.Large-logo-transparent.png";

interface OpenScoreLogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function OpenScoreLogo({ variant = "light", className = "" }: OpenScoreLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Image
        src={redHatReverse}
        alt="Red Hat"
        className="h-5 w-auto"
        style={{ objectFit: "contain" }}
        priority
      />
      <div className="h-4 border-l border-white/40" />
      <span className="font-light text-sm tracking-tight whitespace-nowrap text-white">
        Open Score
      </span>
    </div>
  );
}
