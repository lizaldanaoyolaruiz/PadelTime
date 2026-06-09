import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Solutions from '../components/Solution360';
import Footer from '../components/Footer';
import './Home.css';

const Home = () => {
  return (
    <div className="home-wrapper" id="inicio">
      <Navbar />
      <main>
        <Hero />
        <Solutions />
      </main>
      <Footer />
    </div>
  );
};

export default Home;