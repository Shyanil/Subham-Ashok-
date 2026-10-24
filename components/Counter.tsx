type Props = { value: number; suffix?: string; decimals?: number; plain?: boolean; className?: string };

/** Server-rendered final value; components/Motion.tsx animates it up when scrolled into view. */
export function Counter({ value, suffix = '', decimals = 0, plain, className = '' }: Props) {
  const text = plain ? String(value) : value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span className={`tabular ${className}`}>
      <span data-count={value} data-decimals={decimals} data-plain={plain ? 'true' : undefined}>
        {text}
      </span>
      {suffix}
    </span>
  );
}
