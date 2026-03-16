import { useState, useCallback } from 'react';
import StarField from '@/components/StarField';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CampusMap from '@/components/CampusMap';
import Masterbar, { TabId } from '@/components/Masterbar';
import HelpDeskTab from '@/components/tabs/HelpDeskTab';
import EventsTab from '@/components/tabs/EventsTab';
import HeatmapTab from '@/components/tabs/HeatmapTab';
import OccupancyTab from '@/components/tabs/OccupancyTab';
import IndoorNavTab from '@/components/tabs/IndoorNavTab';
import FeedbackTab from '@/components/tabs/FeedbackTab';
import AdminTab from '@/components/tabs/AdminTab';
import ARVRTab from '@/components/tabs/ARVRTab';
import { campuses } from '@/data/campusData';
import { useCampus } from '@/context/CampusContext';

const Index = () => {
  const [selectedCampusId, setSelectedCampusId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('navigate');
  const [hoveredCampusId, setHoveredCampusId] = useState<string>('sjce');
  const hoveredCampus = campuses.find(c => c.id === hoveredCampusId) ?? campuses[0];
  const { setCampus } = useCampus();

  const selectedCampus = campuses.find((c) => c.id === selectedCampusId);
  // Map campusData id (sjce/sjit) to context campus type
  const campusForContext = selectedCampus?.id === 'sjce' ? 'SJCE' : selectedCampus?.id === 'sjit' ? 'SJIT' : selectedCampus?.id === 'cit' ? 'CIT' : null;

  const handleSelectCampus = useCallback((campusId: string) => {
    setSelectedCampusId(campusId);
    setActiveTab('navigate');
    const mapped = campusId === 'sjce' ? 'SJCE' : campusId === 'sjit' ? 'SJIT' : campusId === 'cit' ? 'CIT' : null;
    if (mapped) setCampus(mapped);
  }, [setCampus]);

  const handleBack = useCallback(() => {
    setSelectedCampusId(null);
    setCampus(null);
  }, [setCampus]);

  const renderTab = () => {
    if (!selectedCampus) return null;
    switch (activeTab) {
      case 'navigate':
        return <CampusMap campus={selectedCampus} onBack={handleBack} />;
      case 'helpdesk':
        return <HelpDeskTab campus={campusForContext} />;
      case 'events':
        return <EventsTab campus={campusForContext} />;
      case 'heatmap':
        return <HeatmapTab campus={selectedCampus} />;
      case 'occupancy':
        return <OccupancyTab campus={selectedCampus} />;
      case 'indoor':
        return <IndoorNavTab campus={selectedCampus} />;
      case 'feedback':
        return <FeedbackTab campus={selectedCampus} />;
      case 'arvr':
        return <ARVRTab campus={selectedCampus} />;
      case 'admin':
        return <AdminTab />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <StarField />
      <Navbar />

      {!selectedCampus ? (
        <Hero onSelectCampus={handleSelectCampus} hoveredCampus={hoveredCampus} onHoverCampus={setHoveredCampusId} />
      ) : (
        <div className="pt-[70px]">
          <Masterbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            accentColor={selectedCampus.color}
          />
          {renderTab()}
        </div>
      )}
    </div>
  );
};

export default Index;
