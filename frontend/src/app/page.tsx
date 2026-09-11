import WeddingHero from "./components/WeddingHero";
import WeddingOpening from "./components/WeddingOpening";

export default function WeddingPage() {
  return (
    <main className="flex flex-col">
      <WeddingOpening />

      <WeddingHero />

      {/* Next sections */}
    </main>
  );
}