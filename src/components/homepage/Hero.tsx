import { useTranslations } from "next-intl";
import SalesBtn from "../layout/SalesBtn";
import TrialBtn from "../layout/TrialBtn";

export default function Hero() {
  const t = useTranslations("Hero");
  return (
    <div className="p-3 mt-16 ">
      <section className="relative px-4 py-12 overflow-hidden lg:py-20 lg:px-6 bg-background-muted">
        {/* GRADIENT BG FOR MOBILE */}
        <div className="absolute lg:hidden w-full h-[700px] z-0 left-0 bg-linear-to-b from-secondary via-primary-50 via-90% to-transparent opacity-20 isolate -translate-y-[250px]"></div>
        {/* END */}
        <div className="relative flex flex-col items-center gap-6 mx-auto max-w-7xl z-2">
          <p className="p-2 text-xs text-center border sm:text-sm border-border text-foreground rounded-2xl">
            {t("badge")}
          </p>
          <h1 className="text-2xl font-semibold text-center lg:text-6xl text-foreground">
            {t("title")}
          </h1>
          <span className="max-w-3xl text-center lg:text-xl">{t("description")}</span>

          {/* BUtton coba2 */}
          <div className="flex gap-4 max-lg:flex-col lg:gap-10">
            <TrialBtn />
            <SalesBtn />
          </div>

          {/* pideo */}
          <div className="py-16 xl:py-20">
            {/* <Image src={gifWebp} className="shadow-dual-glow" alt="gifspead" /> */}
            <video
              playsInline
              autoPlay
              muted
              loop
              controls={false}
              className="w-fit lg:max-w-4xl xl:max-w-6xl shadow-dual-glow"
            >
              <source src={"/videos/HERO_SPEAD.webm"} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    </div>
  );
}
