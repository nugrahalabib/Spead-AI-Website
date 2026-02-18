import { twMerge } from "tailwind-merge";

export default function KelapKelip({ className }: { className?: string }) {
  return (
    <div
      className={twMerge("absolute rounded-full size-60 blur-3xl animate-pulse ", className)}
      style={{
        background: "linear-gradient(270deg, #FF4174d2 0%, #008fe8d2 100%)",
      }}
    ></div>
  );
}
