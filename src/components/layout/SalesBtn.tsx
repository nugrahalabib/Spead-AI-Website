import { HELLO_MESSAGE } from "@/const";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Button from "../reusable/Button";

export default function SalesBtn() {
  const t = useTranslations("CTA");
  return (
    <Button variant="outline" className="min-w-[145px] max-w-[200px] w-full text-sm flex p-0">
      <Link
        href={`https://wa.me/628119152066?text=${HELLO_MESSAGE}`}
        rel="noreferrer"
        target="_blank"
        className="flex items-center justify-center w-full py-2"
      >
        {t("ctaSecondary")}
      </Link>
    </Button>
  );
}
