import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import ClubsSection from '../../components/ClubsSection';
import Solutions from '../../components/Solution360';
import Footer from '../../components/Footer';
import PadelBot from '../../components/PadelBot';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper" id="inicio">
      <Navbar />
      <main>
        <Hero />
        <ClubsSection />
        <Solutions />
      </main>
      <Footer />
      <PadelBot />
    </div>
  );
};

export default Home;
