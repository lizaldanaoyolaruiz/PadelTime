import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedClubs from '../components/FeaturedClubs';
import Solutions from '../components/Solution360'; // <-- Importar esto
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper" id="inicio">
      <Navbar />
      <main>
        <Hero />
        <FeaturedClubs />
        <Solutions /> {/* <-- Agregar esto */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;