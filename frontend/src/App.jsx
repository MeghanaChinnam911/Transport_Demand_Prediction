import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemStatement from './components/ProblemStatement';
import DatasetExplorer from './components/DatasetExplorer';
import DataCleaning from './components/DataCleaning';
import EdaDashboard from './components/EdaDashboard';
import FeatureEngineering from './components/FeatureEngineering';
import ModelSection from './components/ModelSection';
import ResultsSection from './components/ResultsSection';
import LivePrediction from './components/LivePrediction';
import Insights from './components/Insights';
import ArchitectureTimeline from './components/ArchitectureTimeline';
import Footer from './components/Footer';
import { apiService } from './services/api';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [datasetStats, setDatasetStats] = useState(null);

  useEffect(() => {
    apiService.getEdaStats()
      .then(res => {
        if (res && res.dataset_stats) {
          setDatasetStats(res.dataset_stats);
        }
      })
      .catch(err => console.warn('Could not fetch dataset stats:', err));
  }, []);

  const scrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

      <main>
        <Hero
          onExploreClick={() => scrollTo('dataset')}
          onPredictionClick={() => scrollTo('prediction')}
        />

        <ProblemStatement />

        <DatasetExplorer stats={datasetStats} />

        <DataCleaning />

        <EdaDashboard />

        <FeatureEngineering />

        <ModelSection />

        <ResultsSection />

        <LivePrediction />

        <Insights />

        <ArchitectureTimeline />
      </main>

      <Footer onNavClick={scrollTo} />
    </div>
  );
}
