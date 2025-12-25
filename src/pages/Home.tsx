import FQACard from "../components/Home/FQACard";
import HeroSection from "../components/Home/HeroSection";
import Reviews from "../components/Home/Reviews";
import YourHealth from "../components/Home/YourHealth";
import MapHome from "../components/Home/MapHome";
import HowWorks from "../components/Home/HowItWorks/HowWorks";
import TopRated from "../components/Home/TopRated";


const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      {/* How It Works Section */}
      <HowWorks />
      {/* Map Section */}
     <MapHome/>
      {/* Top Rated Section */}
      <TopRated />
      {/* Reviews Section */}

      <Reviews /> 
      {/* FQA */}
      <FQACard />
      {/* Your Health Section */}
      <YourHealth />
    </div>
  );
};

export default Home;
