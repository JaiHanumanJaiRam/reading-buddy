import { useState } from 'react';
import HomeScreen        from './components/HomeScreen';
import ParentSettings    from './components/ParentSettings';
import ThemeSelector     from './components/ThemeSelector';
import ReadingLesson     from './components/ReadingLesson';
import ProgressDashboard from './components/ProgressDashboard';
import './index.css';

const getLevel  = () => parseInt(localStorage.getItem('rb_level') || '1', 10);
const saveLevel = (l) => localStorage.setItem('rb_level', String(l));

export default function App() {
  const [screen,  setScreen]  = useState('home');
  const [players, setPlayers] = useState([]);
  const [level,   setLevel]   = useState(getLevel);
  const [theme,   setTheme]   = useState(null);

  const goHome = () => { setScreen('home'); setTheme(null); setPlayers([]); };

  const handleLevelChange = (l) => { saveLevel(l); setLevel(l); };

  if (screen === 'home') return (
    <HomeScreen
      onSinglePlayer={(name) => { setPlayers([name]); setScreen('theme'); }}
      onTwoPlayer={() => { setPlayers(['Agastyah', 'Arihant']); setScreen('theme'); }}
      onSettings={() => setScreen('settings')}
    />
  );

  if (screen === 'settings') return (
    <ParentSettings
      currentLevel={level}
      onLevelChange={handleLevelChange}
      onBack={() => setScreen('home')}
      onProgress={() => setScreen('progress')}
    />
  );

  if (screen === 'theme') return (
    <ThemeSelector
      level={level}
      onSelect={(t) => { setTheme(t); setScreen('lesson'); }}
      onBack={goHome}
    />
  );

  if (screen === 'lesson') return (
    <ReadingLesson
      level={level}
      theme={theme}
      players={players}
      onBack={() => setScreen('theme')}
    />
  );

  if (screen === 'progress') return <ProgressDashboard onBack={goHome} />;

  return null;
}
