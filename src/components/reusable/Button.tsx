import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "gradient__btn",
    secondary: "bg-secondary text-white hover:bg-secondary-95 transition-all",
    outline:
      "border border-border text-foreground hover:bg-background transition-all hover:text-white",
  };

  return (
    <button className={twMerge(`p-2 rounded-lg hover:cursor-pointer `, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
