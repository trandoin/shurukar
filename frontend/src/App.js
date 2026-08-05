import "@/App.css";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WhyShuruKar } from "@/components/WhyShuruKar";
import { WhatYouGet } from "@/components/WhatYouGet";
import { Founder } from "@/components/Founder";
import { BharatSafar } from "@/components/BharatSafar";
import { LiveDashboard } from "@/components/LiveDashboard";
import { IdeaForm } from "@/components/IdeaForm";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";

function App() {
  return (
    <div className="App overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <WhyShuruKar />
        <WhatYouGet />
        <Founder />
        <BharatSafar />
        <LiveDashboard />
        <IdeaForm />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}

export default App;
