import { useTranslations } from "next-intl";
import KelapKelip from "../reusable/KelapKelip";
import Button from "../reusable/Button";
import { Link } from "@/i18n/navigation";
import { HELLO_MESSAGE } from "@/const";

const PLAN_KEYS = ["freemium", "plus", "pro", "enterprise", "custom"] as const;

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="10" className="fill-secondary/20" />
      <path
        d="M6.5 10.5L9 13L14 8"
        className="stroke-secondary"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pricing() {
  const t = useTranslations("Pricing");

  return (
    <section className="relative px-4 py-8 overflow-hidden lg:py-20 lg:px-16" id="pricing">
      <KelapKelip className="opacity-60 max-lg:top-20" />
      <KelapKelip className="right-0 bottom-20 opacity-60" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h5 className="mb-3">{t("title")}</h5>
          <p className="max-w-xl mx-auto text-sm md:text-base text-primary-95">
            {t("description")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {PLAN_KEYS.map((key) => {
            const isPro = key === "pro";
            const isFreemium = key === "freemium";
            const isCustom = key === "custom";

            const price = t(`${key}.price`);
            const hasIDR = price.startsWith("IDR");

            // Compose feature items
            const items: string[] = [];
            items.push(t(`${key}.users`));
            items.push(`${t("perSeat")} ${t(`${key}.pricePerSeat`)}`);

            const credits = t(`${key}.credits`);
            if (isFreemium) {
              items.push(`${credits} ${t("cumulative")}`);
            } else if (isCustom) {
              items.push(credits);
            } else {
              items.push(`${credits} ${t("perMonth")}`);
            }

            const features = t.raw(`${key}.features`) as string[];
            items.push(...features);

            const cardContent = (
              <>
                {/* Badge */}
                {isPro && (
                  <span className="self-center px-3 py-1 text-xs font-medium rounded-full gradient__btn">
                    {t(`${key}.badge`)}
                  </span>
                )}

                {/* Plan name */}
                <h3 className="text-sm font-medium text-center text-foreground">
                  {t(`${key}.name`)}
                </h3>

                {/* Price */}
                <div className="text-center">
                  {hasIDR ? (
                    <p className="leading-none text-foreground">
                      <span className="text-xs align-top">IDR</span>
                      <span className="text-3xl font-bold md:text-4xl">
                        {price.replace("IDR ", "")}
                      </span>
                    </p>
                  ) : isCustom ? (
                    <p className="py-1.5 text-base font-extrabold md:text-lg text-foreground">
                      {price}
                    </p>
                  ) : (
                    <p className="text-4xl! font-extrabold md:text-lg text-foreground">{price}</p>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-center text-primary-95 min-h-10 lg:min-h-14">
                  {t(`${key}.description`)}
                </p>

                {/* Features list */}
                <ul className="flex-1 space-y-3">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckIcon />
                      <span className="text-xs text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button variant={isPro ? "primary" : "outline"} className="flex w-full p-0 text-sm">
                  <Link
                    href={
                      isFreemium
                        ? "https://spead.caliana.id/auth"
                        : `https://wa.me/628119152066?text=${HELLO_MESSAGE}`
                    }
                    rel="noreferrer"
                    target={isFreemium ? undefined : "_blank"}
                    className="flex items-center justify-center w-full py-2"
                  >
                    {isFreemium ? t("ctaFreemium") : t("ctaSales")}
                  </Link>
                </Button>
              </>
            );

            // Pro card gets gradient border wrapper
            if (isPro) {
              return (
                <div
                  key={key}
                  className="p-0.5 rounded-2xl bg-linear-to-b from-secondary to-primary-50 "
                >
                  <div className="flex flex-col h-full gap-4 p-6 rounded-2xl bg-background-muted lg:min-h-[660px]">
                    {cardContent}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={key}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-background-muted/40 backdrop-blur-sm lg:min-h-[600px]"
              >
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
