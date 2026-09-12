"use client";

import Image from "next/image";

export default function WeddingHero() {
  return (
    <section className="relative flex  flex-col items-center justify-center  px-6 text-center bg-wedding-primary min-h-[600px]">
      
      {/* Top Floral Separator */}
      <div className="absolute left-0 top-[-40px] h-[110px] w-full">
        <Image
          src="/wedding/floral-divider.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Hero Content */}
    <div className="relative z-10 mt-[20px] flex max-w-2xl flex-col items-center px-6 text-center">

    <p className="wedding-heading">
      A Blessed Beginning
    </p>

    <p className="wedding-arabic mt-6">
      وَخَلَقْنَاكُمْ أَزْوَاجًا
    </p>

    <p className="wedding-quote mt-4">
      “And We created you in pairs.”
    </p>

    <span className="wedding-caption mt-2">
      Qur&apos;an 78:8
    </span>

    <div className="my-8 h-px w-12 bg-[#9b6f68]/30" />

    <p className="wedding-body max-w-md">
      With the blessings of Allah, we invite you
      to celebrate our beautiful beginning.
    </p>

    <div className="mt-10">
      <h1 className="wedding-names">
        Maria
      </h1>

      <span className="wedding-names mx-4">
        &
      </span>

      <h1 className="wedding-names">
        Arsalan
      </h1>
    </div>

  </div>
    </section>
  );
}