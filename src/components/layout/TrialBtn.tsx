import { Link } from "@/i18n/navigation";
import Button from "../reusable/Button";
import { HELLO_MESSAGE_TRIAL } from "@/const";
import { useTranslations } from "next-intl";

export default function TrialBtn() {
  const t = useTranslations("CTA");
  return (
    <Button
      variant="primary"
      className="min-w-[145px] max-w-[200px] w-full text-sm flex p-0"
    >
      <Link
        href={`https://wa.me/628119152066?text=${HELLO_MESSAGE_TRIAL}`}
        rel="noreferrer"
        target="_blank"
        className="flex items-center justify-center w-full py-2"
      >
        {t("ctaPrimary")}
      </Link>
    </Button>
  );
}
