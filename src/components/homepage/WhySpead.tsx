import { useTranslations } from "next-intl";
import { CpuCharge, DocumentText, Driver, DriverRefresh, KeyboardOpen } from "iconsax-reactjs";

const CARDS = [
  {
    key: "hybridIntelligence",
    icon: <CpuCharge className="w-5 h-5 text-secondary" />,
    bgFrom: "from-secondary/20",
  },
  {
    key: "docAcceleration",
    icon: <KeyboardOpen className="w-5 h-5 text-primary-50" />,
    bgFrom: "from-secondary/20",
  },
  {
    key: "operationalEfficiency",
    icon: <DocumentText className="w-5 h-5 text-[#8B4DA8]" />,
    bgFrom: "from-secondary/20",
  },
  {
    key: "strategicAlignment",
    icon: <Driver className="w-5 h-5 text-secondary" />,
    bgFrom: "from-secondary/20",
  },
  {
    key: "dataSecurity",
    icon: <DriverRefresh className="w-5 h-5 text-primary-50" />,
    bgFrom: "from-secondary/20",
  },
] as const;

export default function WhySpead() {
  const t = useTranslations("WhySpead");

  return (
    <div className="p-3">
      <section className="relative px-4 py-16 overflow-hidden bg-background-muted">
        {/* GRADIENT BG WHY */}
        <div className="absolute size-[700px] z-0 left-1/2 -translate-x-1/2 bg-linear-to-b rounded-full from-secondary via-primary-50 via-90% to-transparent opacity-20 isolate -top-[450px] blur-3xl" />

        {/* END */}

        <div className="relative z-10 flex flex-col items-center gap-10 mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center">
            <h2 className="mb-3 text-3xl font-semibold md:text-4xl text-foreground">
              {t("sectionTitle")}
            </h2>
            <span className="max-w-xl mx-auto text-sm md:text-base">{t("sectionDescription")}</span>
          </div>

          {/* Cards — horizontal scroll on mobile, 5-col grid on desktop */}
          <div className="w-full pb-2 -mb-2 overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 md:grid md:grid-cols-3 lg:grid-cols-5 min-w-max md:min-w-0">
              {CARDS.map(({ key, icon, bgFrom }) => (
                <div
                  key={key}
                  className="flex flex-col items-center gap-4 p-6 text-center border w-52 md:w-auto rounded-2xl border-border backdrop-blur-sm shrink-0"
                >
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-br ${bgFrom} to-primary-50/20`}
                  >
                    {icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold leading-snug text-foreground">
                    {t(`${key}.title`)}
                  </h3>

                  {/* Description */}
                  <span className="text-xs leading-relaxed">{t(`${key}.description`)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
