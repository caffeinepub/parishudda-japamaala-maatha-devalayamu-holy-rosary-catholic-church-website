import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AnnouncementsBanner from '../components/AnnouncementsBanner';
import MassSchedule from '../components/MassSchedule';
import SpiritualMessage from '../components/SpiritualMessage';
import PrayerModule from '../components/PrayerModule';
import MediaGallery from '../components/MediaGallery';
import DonationCTA from '../components/DonationCTA';
import GoogleMap from '../components/GoogleMap';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ivory font-body">
      <Navbar />
      <AnnouncementsBanner />
      <Hero />
      <MassSchedule />
      <SpiritualMessage />
      <PrayerModule />
      <MediaGallery />
      <DonationCTA />
      <GoogleMap />
      <Footer />
    </div>
  );
}
