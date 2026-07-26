import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import SupportChat from './components/SupportChat/SupportChat';
import WelcomePortal from './components/WelcomePortal/WelcomePortal';

export default function App() {
  const [showPortal, setShowPortal] = useState(true);

  return (
    <>
      {/* Experience Welcome Modal Portal */}
      {showPortal && <WelcomePortal onEnter={() => setShowPortal(false)} />}

      {/* Floating glassmorphic navigation bar */}
      <Navbar />

      {/* Main content sections */}
      <main>
        {/* Cinematic Landing viewport */}
        <Hero />

        {/* Biography & core competencies */}
        <About />

        {/* Masterpieces filtered gallery & lightboxes */}
        <Projects />

        {/* Job history timeline */}
        <Experience />

        {/* Golden floating form validation */}
        <ContactForm />
      </main>

      {/* Minimal copyright signature */}
      <Footer />

      {/* Intelligent AI floating assistant */}
      <SupportChat />
    </>
  );
}
