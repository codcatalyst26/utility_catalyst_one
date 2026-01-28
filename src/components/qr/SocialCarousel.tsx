import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { SOCIALS, SocialItem } from "@/config/socials";

type Props = {
  onSelect: (social: SocialItem) => void;
  onClear?: () => void;
};

export const SocialCarousel = ({ onSelect, onClear }: Props) => {
  const [index, setIndex] = useState(0);
  const visibleCount = 5;

  const canScrollUp = index > 0;
  const canScrollDown = index + visibleCount < SOCIALS.length;

  return (
    <div className="flex flex-col items-center gap-2 w-100">
      {/* Up Arrow */}
      <button
        onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        disabled={!canScrollUp}
        className="text-muted-foreground disabled:opacity-30"
      >
        <ChevronUp />
      </button>

      {/* Icons */}
      <div className="flex flex-col gap-3">
        {SOCIALS.slice(index, index + visibleCount).map((s) => (
          <button
            key={s.id}
            onClick={() => (s.id === "block" ? onClear?.() : onSelect(s))}
            className="w-10 h-10 rounded-md bg-white border shadow-md flex items-center justify-center hover:scale-105 transition"
          >
            <img src={s.logo} alt={s.label} className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Down Arrow */}
      <button
        onClick={() =>
          setIndex((i) => Math.min(i + 1, SOCIALS.length - visibleCount))
        }
        disabled={!canScrollDown}
        className="text-muted-foreground disabled:opacity-30"
      >
        <ChevronDown />
      </button>
    </div>
  );
};
