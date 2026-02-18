import { twMerge } from "tailwind-merge";

export default function Tiktok({ className }) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={twMerge(
        "text-primary-50 hover:text-white transition-colors",
        className
      )}
    >
      <path
        d="M16.6002 6.32C15.9166 5.53962 15.5399 4.53743 15.5402 3.5H12.4502V15.9C12.4263 16.571 12.143 17.2066 11.6599 17.6729C11.1768 18.1393 10.5316 18.3999 9.86016 18.4C8.44016 18.4 7.26016 17.24 7.26016 15.8C7.26016 14.08 8.92016 12.79 10.6302 13.32V10.16C7.18016 9.7 4.16016 12.38 4.16016 15.8C4.16016 19.13 6.92016 21.5 9.85016 21.5C12.9902 21.5 15.5402 18.95 15.5402 15.8V9.51C16.7932 10.4099 18.2975 10.8926 19.8402 10.89V7.8C19.8402 7.8 17.9602 7.89 16.6002 6.32Z"
        fill="currentColor"
      />
    </svg>
  );
}
