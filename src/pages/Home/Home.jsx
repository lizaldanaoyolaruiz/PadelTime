import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import ClubsSection from '../../components/ClubsSection';
import Solutions from '../../components/Solution360';
import TorneosSection from '../../components/TorneosSection';
import Footer from '../../components/Footer';
import PadelBot from '../../components/PadelBot';
import './home.css';

const Home = () => {
  return (
    <div className="home-wrapper" id="inicio">
      <Navbar />
      <main>
        <Hero />
        <ClubsSection />
        <TorneosSection />
        <Solutions />
      </main>
      <Footer />
      <PadelBot />
    </div>
  );
};

export default Home;
