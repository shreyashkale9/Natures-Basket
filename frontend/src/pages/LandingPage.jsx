import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import LoginOptionsSection from '../components/landing/LoginOptionsSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <LoginOptionsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

