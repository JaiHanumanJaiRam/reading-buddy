import { useEffect, useMemo, useRef, useState } from 'react';
import { CONTENT, LEVELS, THEMES } from '../data/books';
import {
  cancelSpeech,
  checkSpeech,
  delay,
  listenForSpeech,
  playDinoRoar,
  playRewardSound,
  playTryAgainSound,
  speak,
  speakLetter,
} from '../utils/speech';
import { recordAttempt } from '../utils/progress';
import EncouragementScreen from './EncouragementScreen';
import RewardScreen from './RewardScreen';

const ENCOURAGEMENTS = [
  (n) => `You can do it ${n}! Let us try again!`,
  (n) => `Almost there ${n}! One more time!`,
  (n) => `Keep going ${n}, you are doing great!`,
  (n) => `Do not give up ${n}! You have got this!`,
  (n) => `Super try ${n}! Let us go again!`,
];

const PHASE = {
  START:    'start',
  TEACHING: 'teaching',
  LISTENING:'listening',
  SUCCESS:  'success',
  RETRY:    'retry',
  COMPLETE: 'complete',
};

// Fisher-Yates shuffle (returns new array)
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function ReadingLesson({ level, theme, players, onBack }) {
  // players = ['Agastyah'] for single, ['Agastyah','Arihant'] for two-player
  const twoPlayer  = players.length === 2;
  const allContent = CONTENT[theme][level];
  const themeMeta  = THEMES.find(t => t.id === theme);
  const levelMeta  = LEVELS.find(l => l.id === level);

  // ── Word pool (shuffled, loops) ──────────────────────────────────────
  const pool       = useMemo(() => shuffle(allContent), [theme, level]);
  const poolIdxRef = useRef(0);
  const getNextItem = () => {
    const item = pool[poolIdxRef.current % pool.length];
    poolIdxRef.current++;
    return item;
  };

  // ── State ────────────────────────────────────────────────────────────
  const [playerIdx,    setPlayerIdx]    = useState(0);
  const [sentence,     setSentence]     = useState(() => getNextItem());
  const [phase,        setPhase]        = useState(PHASE.START);
  const [highlightWord,setHighlightWord]= useState(-1);
  const [spelling,     setSpelling]     = useState(null);
  const [statusMsg,    setStatusMsg]    = useState('');
  const [tryCount,     setTryCount]     = useState(0);
  const [encouragement,setEncouragement]= useState('');
  const [isListening,  setIsListening]  = useState(false);
  // session scores: { PlayerName: { correct, total } }
  const [scores, setScores] = useState(() =>
    Object.fromEntries(players.map(n => [n, { correct: 0, total: 0 }]))
  );

  const cancelRef   = useRef(false);
  const playerIdxRef= useRef(0);
  playerIdxRef.current = playerIdx;

  const currentPlayer = players[playerIdx];
  const nextPlayer    = twoPlayer ? players[(playerIdx + 1) % players.length] : null;

  // Cleanup on unmount
  useEffect(() => () => { cancelRef.current = true; cancelSpeech(); }, []);

  // ── Teaching sequence ────────────────────────────────────────────────
  const runTeachingSequence = async (sent) => {
    cancelRef.current = false;
    setPhase(PHASE.TEACHING);
    setHighlightWord(-1);
    setSpelling(null);
    setStatusMsg('');

    for (let wi = 0; wi < sent.words.length; wi++) {
      if (cancelRef.current) return;
      const word = sent.words[wi];
      setHighlightWord(wi);

      setStatusMsg(`Listen: "${word}"`);
      await speak(word, { rate: 0.68, pitch: 0.78 });
      await delay(180);
      if (cancelRef.current) return;

      const letters = word.replace(/[^a-zA-Z]/g, '').toUpperCase().split('');
      if (letters.length > 0) {
        setStatusMsg(`Spelling: ${letters.join(' - ')}`);
        for (let li = 0; li < letters.length; li++) {
          if (cancelRef.current) return;
          setSpelling({ letters, current: li });
          await speakLetter(letters[li]);
          await delay(120);
        }
        setSpelling(null);
        await delay(160);
        if (cancelRef.current) return;
      }

      setStatusMsg(`"${word}"`);
      await speak(word, { rate: 0.75, pitch: 0.82 });
      await delay(240);
      setHighlightWord(-1);
    }

    if (cancelRef.current) return;

    if (sent.words.length > 1) {
      setHighlightWord(-2);
      setStatusMsg('Now listen to the whole sentence!');
      await speak('Amazing!', { rate: 0.88, pitch: 0.88 });
      await delay(100);
      if (cancelRef.current) return;
      await speak('Now listen to the whole sentence!', { rate: 0.82, pitch: 0.80 });
      await delay(180);
      if (cancelRef.current) return;
      await speak(sent.text, { rate: 0.78, pitch: 0.80 });
      await delay(300);
      if (cancelRef.current) return;
    }

    setHighlightWord(-1);
    setStatusMsg('');
    setPhase(PHASE.LISTENING);

    const pName = players[playerIdxRef.current];
    await speak(`Okay ${pName}!`, { rate: 0.88, pitch: 0.86 });
    await delay(130);
    if (cancelRef.current) return;
    const cue = sent.words.length === 1 ? 'Now you say this word!' : 'Your turn now!';
    await speak(cue, { rate: 0.85, pitch: 0.82 });
    if (cancelRef.current) return;
    startListening();
  };

  // ── Listening ────────────────────────────────────────────────────────
  const startListening = async () => {
    setIsListening(true);
    setStatusMsg('Listening… read it out loud!');
    const transcript = await listenForSpeech(12000);
    setIsListening(false);
    if (cancelRef.current) return;

    if (transcript === '__NOT_SUPPORTED__') {
      setStatusMsg('Please use Safari for speech recognition!');
      return;
    }

    const pName   = players[playerIdxRef.current];
    const correct = checkSpeech(transcript, sentence.text);
    const attempt = tryCount + 1;

    if (correct) {
      // Save progress
      recordAttempt(pName, {
        level, theme,
        text:     sentence.text,
        correct:  true,
        attempts: attempt,
      });
      setScores(prev => ({
        ...prev,
        [pName]: { correct: prev[pName].correct + 1, total: prev[pName].total + 1 },
      }));
      playDinoRoar();
      playRewardSound();
      setPhase(PHASE.SUCCESS);
    } else {
      recordAttempt(pName, {
        level, theme,
        text:     sentence.text,
        correct:  false,
        attempts: attempt,
      });
      setScores(prev => ({
        ...prev,
        [pName]: { ...prev[pName], total: prev[pName].total + 1 },
      }));
      playTryAgainSound();
      const msg = ENCOURAGEMENTS[tryCount % ENCOURAGEMENTS.length](pName);
      setEncouragement(msg);
      setTryCount(c => c + 1);
      setPhase(PHASE.RETRY);
      await speak(msg, { rate: 0.87, pitch: 0.82 });
    }
  };

  // ── Advance to next turn / player ────────────────────────────────────
  const handleNext = () => {
    if (twoPlayer) {
      // Switch player, pick new word
      const nextIdx = (playerIdx + 1) % players.length;
      setPlayerIdx(nextIdx);
      playerIdxRef.current = nextIdx;
      setSentence(getNextItem());
    } else {
      // Single player — pick next word from pool
      const next = getNextItem();
      // After full loop, offer to exit (simple: just keep going for now)
      setSentence(next);
    }
    setTryCount(0);
    setHighlightWord(-1);
    setSpelling(null);
    setStatusMsg('');
    setPhase(PHASE.START);
  };

  const handleRetry = async () => {
    cancelRef.current = false;
    setTryCount(c => c + 1);
    setPhase(PHASE.LISTENING);
    const pName = players[playerIdxRef.current];
    await speak(`Try again ${pName}!`, { rate: 0.88, pitch: 0.86 });
    if (cancelRef.current) return;
    startListening();
  };

  // ── Render helpers ───────────────────────────────────────────────────
  if (phase === PHASE.SUCCESS) {
    return (
      <RewardScreen
        childName={currentPlayer}
        sentence={sentence.text}
        theme={theme}
        onNext={handleNext}
        nextPlayerName={nextPlayer}
        scores={scores}
        players={players}
      />
    );
  }
  if (phase === PHASE.RETRY) {
    return (
      <EncouragementScreen
        message={encouragement}
        theme={theme}
        onTryAgain={handleRetry}
      />
    );
  }

  const themeEmoji = themeMeta.emoji;

  return (
    <div className="lesson-screen" style={{ background: themeMeta.bg }}>
      {/* Minimal back */}
      <button className="lesson-back" onClick={() => { cancelRef.current = true; cancelSpeech(); onBack(); }}>
        ←
      </button>

      {/* Whose turn — two-player only */}
      {twoPlayer && (
        <div className="turn-label" style={{ color: themeMeta.color }}>
          {themeEmoji} {currentPlayer}
        </div>
      )}

      {/* Hero word */}
      <div className="word-stage">
        {sentence.words.map((word, wi) => (
          <span key={wi} className={`stage-word ${
            highlightWord === wi ? 'word-active' :
            highlightWord === -2 ? 'word-all' : ''
          }`}>{word}</span>
        ))}
      </div>

      {/* Spelling */}
      {spelling && (
        <div className="spelling-box">
          {spelling.letters.map((l, i) => (
            <span key={i} className={`spell-letter ${
              i === spelling.current ? 'spell-active' :
              i <  spelling.current  ? 'spell-done'   : ''
            }`}>{l}</span>
          ))}
        </div>
      )}

      {statusMsg && <p className="status-msg">{statusMsg}</p>}

      {phase === PHASE.START && (
        <div className="lesson-cta">
          <p className="your-turn-msg">
            {twoPlayer ? `${currentPlayer}'s turn` : `Ready ${currentPlayer}?`}
          </p>
          <button className="start-btn" onClick={() => runTeachingSequence(sentence)}>
            {themeEmoji}
          </button>
        </div>
      )}

      {phase === PHASE.LISTENING && (
        <div className="lesson-cta">
          <div className={`listen-badge ${isListening ? 'listening' : ''}`}>
            {isListening ? '🎙️' : '🎤'}
          </div>
          {isListening && <p className="listening-hint">Read it out loud!</p>}
        </div>
      )}

      {phase === PHASE.TEACHING && (
        <div className="teaching-mascot">{themeEmoji}</div>
      )}
    </div>
  );
}
