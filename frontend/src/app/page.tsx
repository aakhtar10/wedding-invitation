
import WeddingHero from "./components/WeddingHero";
import WeddingScratch from "./components/WeddingScratch";
import WeddingCountdown from "./components/WeddingCountdown";
import WeddingCeremonies from "./components/WeddingCeremonies";
import WeddingVenue from "./components/WeddingVenue";
import WeddingClosing from "./components/WeddingClosing";
import WeddingExperience from "./components/WeddingExperience";
import WeddingCalendar from "./components/WeddingCalendar";

export default function WeddingPage() {
  return (
    <main className="flex flex-col">
      <WeddingExperience>
        <WeddingHero />
        <WeddingScratch />
        <WeddingCountdown />
        <WeddingCeremonies />
        <WeddingVenue />
        <WeddingCalendar/>
        <WeddingClosing />
      </WeddingExperience>
    </main>
  );
}
