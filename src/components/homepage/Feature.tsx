import { useTranslations } from "next-intl";
import KelapKelip from "../reusable/KelapKelip";
import AIBanget from "../reusable/AIBanget";

interface FeatureCardProps {
  stat: string;
  title: string;
  description: string;
  className?: string;
  aiBangetColor?: string;
}

function FeatureCard({
  stat,
  title,
  description,
  className = "",
  aiBangetColor = "text-secondary",
}: FeatureCardProps) {
  return (
    <div
      className={`flex flex-col gap-4 p-6 rounded-2xl border border-border bg-white/5 backdrop-blur-sm ${className}`}
    >
      {/* Badge */}
      <span className="self-start text-[8px] px-2.5 py-1 rounded-full border border-primary-95 text-primary-95 leading-none">
        {stat}
      </span>

      {/* Icon + Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/30 to-primary-50/30 shrink-0">
          <AIBanget className={`w-5 h-5 ${aiBangetColor}`} />
        </div>
        <h3 className="text-xs font-semibold tracking-wide lg:text-sm text-foreground">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed lg:text-sm text-primary-95">{description}</p>
    </div>
  );
}

export default function Feature() {
  const t = useTranslations("Features");

  return (
    <section className="relative px-4 py-8 overflow-hidden lg:py-28 lg:px-16 scroll-m-36" id="features">
      <KelapKelip className="opacity-60 max-lg:top-14 size-40" />
      <KelapKelip className="right-0 bottom-20 size-52 opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="max-w-lg mb-10">
              <h2 className="mb-3 text-xl font-bold lg:text-2xl text-foreground">
                {t("sectionTitle")}
              </h2>
              <p className="text-sm text-primary-95 lg:text-base">{t("sectionDescription")}</p>
            </div>
            <FeatureCard
              stat={t("dailyPlanner.stat")}
              title={t("dailyPlanner.title")}
              description={t("dailyPlanner.description")}
              className=""
            />
          </div>
          <div className="flex flex-col justify-center gap-3 lg:col-span-4">
            <FeatureCard
              stat={t("docBuilder.stat")}
              title={t("docBuilder.title")}
              description={t("docBuilder.description")}
              aiBangetColor="text-primary-50"
            />
            <FeatureCard
              stat={t("docAssistant.stat")}
              title={t("docAssistant.title")}
              description={t("docAssistant.description")}
              aiBangetColor="text-[#8B4DA8]"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 lg:col-span-3">
            <FeatureCard
              stat={t("aiPartner.stat")}
              title={t("aiPartner.title")}
              description={t("aiPartner.description")}
              className="lg:min-h-52"
            />
            <FeatureCard
              stat={t("adminPanel.stat")}
              title={t("adminPanel.title")}
              description={t("adminPanel.description")}
              className="lg:min-h-52"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
