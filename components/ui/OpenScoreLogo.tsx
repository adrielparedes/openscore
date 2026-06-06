interface OpenScoreLogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function OpenScoreLogo({ variant = "light", className = "" }: OpenScoreLogoProps) {
  const textColor = variant === "light" ? "#ffffff" : "#1e293b";
  const dividerColor = variant === "light" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 272 44"
      className={className}
      role="img"
      aria-label="Red Hat Open Score"
    >
      <g transform="translate(0, 4) scale(0.24)">
        <path
          d="M127.47 83.49c12.51 0 30.61-2.58 30.61-17.46a14 14 0 0 0-.31-3.42l-7.45-32.36c-1.72-7.12-3.23-10.35-15.73-16.6C124.89 8.69 103.76.5 97.51.5 91.69.5 90 8 83.06 8c-6.68 0-11.64-5.6-17.89-5.6-6 0-9.91 4.09-12.93 12.5 0 0-8.41 23.72-9.49 27.16A6.43 6.43 0 0 0 42.53 44c0 9.22 36.3 39.45 84.94 39.45M160 72.07c1.73 8.19 1.73 9.05 1.73 10.13 0 14-15.74 21.77-36.43 21.77C78.54 104 37.58 76.6 37.58 58.49a18.45 18.45 0 0 1 1.51-7.33C22.27 52 .5 55 .5 74.22c0 31.48 74.59 70.28 133.65 70.28 45.28 0 56.7-20.48 56.7-36.65 0-12.72-11-27.16-30.83-35.78"
          fill="#ee0000"
        />
        <path
          d="M160 72.07c1.73 8.19 1.73 9.05 1.73 10.13 0 14-15.74 21.77-36.43 21.77C78.54 104 37.58 76.6 37.58 58.49a18.45 18.45 0 0 1 1.51-7.33l3.66-9.06A6.43 6.43 0 0 0 42.53 44c0 9.22 36.3 39.45 84.94 39.45 12.51 0 30.61-2.58 30.61-17.46a14 14 0 0 0-.31-3.42Z"
          fill="#000000"
        />
      </g>

      <text
        x="50"
        y="27"
        fontFamily="'Red Hat Display', 'Red Hat Text', system-ui, -apple-system, sans-serif"
        fontSize="14"
        fontWeight="700"
        fill={textColor}
        letterSpacing="0.3"
      >
        Red Hat
      </text>

      <line x1="122" y1="8" x2="122" y2="36" stroke={dividerColor} strokeWidth="1" />

      <text
        x="134"
        y="29"
        fontFamily="'Red Hat Display', 'Red Hat Text', system-ui, -apple-system, sans-serif"
        fontSize="20"
        fontWeight="300"
        fill={textColor}
        letterSpacing="0.5"
      >
        Open Score
      </text>
    </svg>
  );
}
