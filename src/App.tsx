import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
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
    </>
  );
}
