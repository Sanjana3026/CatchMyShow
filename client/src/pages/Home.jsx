import react from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import TrailersSection from '../components/TrailersSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <FeatureSection/>
      <TrailersSection/>
    </div>
  );
}

export default Home;