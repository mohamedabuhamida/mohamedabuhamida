"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeCopyButtonProps {
  value: string;
}

export default function CodeCopyButton({ value }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }}
      className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/55 px-3 py-1.5 text-xs text-text/75 transition hover:border-accent/50 hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
