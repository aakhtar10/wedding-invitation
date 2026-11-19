
import WeddingHero from "./components/WeddingHero";
import WeddingScratch from "./components/WeddingScratch";
import WeddingCountdown from "./components/WeddingCountdown";
import WeddingCeremonies from "./components/WeddingCeremonies";
import WeddingVenue from "./components/WeddingVenue";
import WeddingClosing from "./components/WeddingClosing";
import WeddingMusic from "./components/WeddingMusic";
import WeddingExperience from "./components/WeddingExperience";

export default function WeddingPage() {
  return (
    <main className="flex flex-col">
      <WeddingExperience>
        <WeddingHero />
        <WeddingScratch />
        <WeddingCountdown />
        <WeddingCeremonies />
        <WeddingVenue />
        <WeddingClosing />
      </WeddingExperience>
    </main>
  );
}
