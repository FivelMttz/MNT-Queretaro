import React, { useState, useEffect } from 'react';
import { PLAYS, VENUES, ACADEMIC_ACTIVITIES, Play, Venue, AcademicActivity } from './data/mntData';
import { HeaderNavbar } from './components/HeaderNavbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { PlayDetailModal } from './components/PlayDetailModal';
import { ItineraryModal } from './components/ItineraryModal';
import { HomeView } from './views/HomeView';
import { ProgramView } from './views/ProgramView';
import { VenuesView } from './views/VenuesView';
import { CuratorialView } from './views/CuratorialView';
import { AcademicView } from './views/AcademicView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);
  const [isItineraryOpen, setIsItineraryOpen] = useState<boolean>(false);

  // Saved plays in itinerary
  const [savedPlayIds, setSavedPlayIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('46mnt_saved_plays');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Saved academic activities in itinerary
  const [savedActivityIds, setSavedActivityIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('46mnt_saved_activities');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Pre-filter states passed when navigating between views
  const [programFilterOptions, setProgramFilterOptions] = useState<{
    day?: number | null;
    venueId?: string;
  }>({});

  // Sync saved plays to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('46mnt_saved_plays', JSON.stringify(savedPlayIds));
    } catch {
      // LocalStorage error ignore
    }
  }, [savedPlayIds]);

  // Sync saved activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('46mnt_saved_activities', JSON.stringify(savedActivityIds));
    } catch {
      // LocalStorage error ignore
    }
  }, [savedActivityIds]);

  const toggleSavePlay = (play: Play, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedPlayIds((prev) => {
      if (prev.includes(play.id)) {
        return prev.filter((id) => id !== play.id);
      } else {
        return [...prev, play.id];
      }
    });
  };

  const toggleSaveActivity = (activity: AcademicActivity, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedActivityIds((prev) => {
      if (prev.includes(activity.id)) {
        return prev.filter((id) => id !== activity.id);
      } else {
        return [...prev, activity.id];
      }
    });
  };

  const isSavedPlay = (playId: string) => savedPlayIds.includes(playId);
  const isSavedActivity = (activityId: string) => savedActivityIds.includes(activityId);

  const savedPlaysList = PLAYS.filter((p) => savedPlayIds.includes(p.id));
  const savedActivitiesList = ACADEMIC_ACTIVITIES.filter((a) => savedActivityIds.includes(a.id));

  const totalSavedCount = savedPlayIds.length + savedActivityIds.length;

  const handleNavigateTab = (
    tab: string,
    filterOptions?: { day?: number | null; venueId?: string }
  ) => {
    if (filterOptions) {
      setProgramFilterOptions(filterOptions);
    } else {
      setProgramFilterOptions({});
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#1F1D1B]">
      {/* Global Header */}
      <HeaderNavbar
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigateTab(tab)}
        savedCount={totalSavedCount}
        onOpenItinerary={() => setIsItineraryOpen(true)}
      />

      {/* Main Content Area with safe bottom padding on mobile */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-24 lg:pb-12">
        {currentTab === 'inicio' && (
          <HomeView
            onSelectPlay={(play) => setSelectedPlay(play)}
            onNavigateTab={handleNavigateTab}
            isSavedPlay={isSavedPlay}
            onToggleSavePlay={toggleSavePlay}
            onOpenItinerary={() => setIsItineraryOpen(true)}
            savedCount={totalSavedCount}
          />
        )}

        {currentTab === 'programa' && (
          <ProgramView
            onSelectPlay={(play) => setSelectedPlay(play)}
            isSavedPlay={isSavedPlay}
            onToggleSavePlay={toggleSavePlay}
            initialDay={programFilterOptions.day ?? null}
            initialVenueId={programFilterOptions.venueId ?? 'all'}
          />
        )}

        {currentTab === 'sedes' && (
          <VenuesView onSelectPlay={(play) => setSelectedPlay(play)} />
        )}

        {currentTab === 'curaduria' && <CuratorialView />}

        {currentTab === 'actividades' && (
          <AcademicView
            isSaved={isSavedActivity}
            onToggleSave={toggleSaveActivity}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <Footer onSelectTab={(tab) => handleNavigateTab(tab)} />

      {/* Mobile Bottom Navigation (fixed at bottom on mobile viewports) */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => handleNavigateTab(tab)}
        savedCount={totalSavedCount}
        onOpenItinerary={() => setIsItineraryOpen(true)}
      />

      {/* Play Detail Modal (Vista 03) */}
      <PlayDetailModal
        play={selectedPlay}
        onClose={() => setSelectedPlay(null)}
        isSaved={selectedPlay ? isSavedPlay(selectedPlay.id) : false}
        onToggleSave={(play) => toggleSavePlay(play)}
        onSelectPlay={(play) => setSelectedPlay(play)}
        allPlays={PLAYS}
      />

      {/* Itinerary Modal (supporting both Plays & Academic Activities) */}
      <ItineraryModal
        isOpen={isItineraryOpen}
        onClose={() => setIsItineraryOpen(false)}
        savedPlays={savedPlaysList}
        savedActivities={savedActivitiesList}
        onRemovePlay={(id) => setSavedPlayIds((prev) => prev.filter((p) => p !== id))}
        onRemoveActivity={(id) => setSavedActivityIds((prev) => prev.filter((a) => a !== id))}
        onClearAll={() => {
          setSavedPlayIds([]);
          setSavedActivityIds([]);
        }}
        onSelectPlay={(play) => setSelectedPlay(play)}
      />
    </div>
  );
}
