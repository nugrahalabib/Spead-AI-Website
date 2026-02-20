import { useTranslations } from "next-intl";
import SalesBtn from "../layout/SalesBtn";
import TrialBtn from "../layout/TrialBtn";

export default function CTA() {
  const t = useTranslations("CTA");
  return (
    <div className="p-3" id="contact">
      <section className="relative px-10 py-10 overflow-hidden lg:py-20 bg-background-muted">
        <div className="relative flex flex-col items-center mx-auto text-center max-w-7xl z-2">
          <h5 className="">{t("title")}</h5>
          <span className="max-w-xl mx-auto mt-6">{t("description")}</span>

          <div className="flex flex-col gap-6 mt-10 lg:flex-row lg:gap-10 max-w-80">
            <TrialBtn />
            <SalesBtn />
          </div>
        </div>
      </section>
    </div>
  );
}
