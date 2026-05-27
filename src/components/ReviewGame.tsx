/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Volume2, Sparkles, HelpCircle, RefreshCw, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { playSound, speakText } from '../utils/audio';
import IllustrationSVG from './IllustrationSVG';

interface GameItem {
  id: string;
  nameEn: string;
  nameZh: string;
  pinyin: string;
  sceneId: number;
  promptVoice: string;
  promptText: string;
  praiseVoice: string;
  praiseText: string;
}

const GAME_CHALLENGES: GameItem[] = [
  {
    id: 'sun',
    nameEn: 'sun',
    nameZh: '太阳',
    pinyin: 'tài yáng',
    sceneId: 5,
    promptText: 'Where is the SUN? 请找出金黄色的太阳公公吧！',
    promptVoice: 'Where is the sun?',
    praiseText: 'Excellent! Sun! 太阳正在对你微笑呢！',
    praiseVoice: 'Awesome! Sun!',
  },
  {
    id: 'eyes',
    nameEn: 'eyes',
    nameZh: '眼睛',
    pinyin: 'yǎn jing',
    sceneId: 4,
    promptText: 'Where are the EYES? 找出小米亮晶晶的眼睛吧！',
    promptVoice: 'Where are the eyes?',
    praiseText: 'Wow! Eyes! 闪闪明亮的大眼睛，眨一眨！',
    praiseVoice: 'Yes! Eyes! Open your eyes!',
  },
  {
    id: 'hands',
    nameEn: 'hands',
    nameZh: '小手',
    pinyin: 'xiǎo shǒu',
    sceneId: 6,
    promptText: 'Where are the HANDS? 找找小米伸出来的两只可爱小手！',
    promptVoice: 'Where are the hands?',
    praiseText: 'Super! Hands! 挥挥我们的小手！',
    praiseVoice: 'Super! Hands! Show me your hands!',
  },
  {
    id: 'bed',
    nameEn: 'bed',
    nameZh: '小床',
    pinyin: 'xiǎo chuáng',
    sceneId: 3,
    promptText: 'Where is the BED? 暖和、好躺的小胖床在哪里呢？',
    promptVoice: 'Where is the bed?',
    praiseText: 'Perfect! Bed! 舒服的小床，起床啦！',
    praiseVoice: 'Perfect! Bed!',
  },
  {
    id: 'happy',
    nameEn: 'happy',
    nameZh: '快乐的兔兔/小米',
    pinyin: 'kuài lè',
    sceneId: 8,
    promptText: 'Where is HAPPY? 找出小米抱着小兔子最开心的笑容！',
    promptVoice: 'Where is happy?',
    praiseText: 'Lovely! Happy! 抱着软乎乎的兔子，真是太快乐啦！',
    praiseVoice: 'Lovely! I am happy!',
  },
];

export default function ReviewGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'answering' | 'completed'>('intro');
  const [wrongCount, setWrongCount] = useState(0);
  const [scoreCoins, setScoreCoins] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentChallenge = GAME_CHALLENGES[currentIdx];

  const startGame = () => {
    playSound('chime');
    setGameState('playing');
    setCurrentIdx(0);
    setWrongCount(0);
    setScoreCoins(0);
    setShowCelebration(false);
  };

  // Trigger prompt speech whenever challenge changes
  useEffect(() => {
    if (gameState === 'playing' && currentChallenge) {
      const timer = setTimeout(() => {
        speakPrompt();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIdx, gameState]);

  const speakPrompt = () => {
    playSound('chirp');
    speakText(currentChallenge.promptVoice, {
      lang: 'en',
      pitch: 1.3,
      rate: 0.7,
    });
  };

  const speakPraise = () => {
    speakText(currentChallenge.praiseVoice, {
      lang: 'en',
      pitch: 1.4,
      rate: 0.8,
    });
  };

  const handleSVGClick = (clickedElementName: string) => {
    if (gameState !== 'playing') return;

    if (clickedElementName === currentChallenge.id) {
      playSound('success');
      setScoreCoins((prev) => prev + 10);
      setGameState('answering');
      setShowCelebration(true);
      speakPraise();
      setTimeout(() => setShowCelebration(false), 2200);
    } else {
      playSound('pop');
      setWrongCount((prev) => prev + 1);
      speakText(`Uh-oh! Can you find the ${currentChallenge.nameEn}?`, {
        lang: 'en',
        pitch: 1.3,
        rate: 0.8,
      });
    }
  };

  const nextQuestion = () => {
    playSound('pop');
    if (currentIdx < GAME_CHALLENGES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setGameState('playing');
    } else {
      playSound('morning');
      setGameState('completed');
    }
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-[40px] border-8 border-white shadow-2xl max-w-4xl mx-auto w-full my-4">
      
      {/* Target Game Header with cute title */}
      <div className="flex justify-between items-center w-full pb-4 border-b border-[#E6E2D1] mb-5">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-art-orange text-white rounded-xl shadow-sm">
            <Award className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h3 className="font-serif font-black text-art-navy text-lg md:text-xl">早安指一指 Play & Seek 🎯</h3>
            <p className="font-sans text-xs text-art-sage font-medium">和家长一起，在绘本上寻找对应词语吧！</p>
          </div>
        </div>
 
        {/* Dynamic coins indicator */}
        <div className="flex items-center gap-1.5 bg-art-green-pale/50 px-4 py-2 rounded-full border border-art-green-pale shadow-inner">
          <span className="text-sm">🪙</span>
          <span className="font-mono font-black text-art-navy text-sm">{scoreCoins} XP</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="text-center py-8 px-4 flex flex-col items-center max-w-md w-full"
          >
            <div className="w-24 h-24 bg-art-cream rounded-full flex items-center justify-center shadow-md relative mb-6 border-b-4 border-art-green-pale">
              <span className="text-4xl animate-bounce">👉</span>
              <Sparkles className="absolute -top-1 -right-1 text-art-orange w-8 h-8 animate-pulse" />
            </div>

            <h4 className="font-serif font-bold text-art-navy text-2xl mb-2">准备好玩小游戏了吗？</h4>
            <p className="font-sans text-sm text-balance leading-relaxed text-art-sage mb-6 font-medium">
              小米已经带你学习了眼睛 (Eyes)、小手 (Hands)、太阳 (Sun) 还有开心 (Happy)。根据发音，试着在画面中寻找点击指定核心词汇吧！
            </p>

            <button
              onClick={startGame}
              className="px-8 py-4 bg-art-orange hover:bg-art-terracotta text-white font-sans font-bold text-lg rounded-full shadow-md shadow-orange-200 transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              🚀 开启早安指一指
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center"
          >
            {/* Task Prompt Box */}
            <div className="bg-art-cream p-5 rounded-[2rem] border border-[#E6E2D1] w-full mb-6 shadow-sm flex items-center justify-between gap-4 relative">
              <div className="flex items-center gap-4">
                <span className="p-3 bg-white rounded-full text-art-orange shadow-sm shrink-0 border border-[#E6E2D1]">
                  <HelpCircle className="w-6 h-6" />
                </span>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-art-terracotta text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Quest {currentIdx + 1}/5</span>
                    <p className="font-mono text-xs text-art-sage font-bold uppercase tracking-wider">Find the: <span className="underline decoration-2 text-art-orange">{currentChallenge.nameEn}</span></p>
                  </div>
                  <h4 className="font-serif font-bold text-art-navy text-base md:text-lg mt-1 text-left">
                    {currentChallenge.promptText}
                  </h4>
                </div>
              </div>

              {/* Repeat voice button */}
              <button
                onClick={speakPrompt}
                className="p-3.5 bg-art-orange hover:bg-art-terracotta text-white rounded-2xl shadow transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                title="播放发音"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Main Interactive Stage */}
            <div className="relative aspect-video w-full max-w-2xl rounded-[30px] overflow-hidden border-8 border-white shadow-2xl bg-art-cream select-none">
              <IllustrationSVG
                sceneId={currentChallenge.sceneId}
                onElementClick={handleSVGClick}
                gameTarget={currentChallenge.id}
              />

              {/* Sweet overlay helper highlight flash */}
              <div className="absolute top-3 left-4 bg-art-navy/80 border border-white/10 px-3 py-1 text-white text-[11px] font-sans font-medium rounded-full pointer-events-none">
                🎯 找一找：在画中直接点击 “{currentChallenge.nameZh}” 的区域！
              </div>
            </div>
          </motion.div>
        )}

        {gameState === 'answering' && (
          <motion.div
            key="answering"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center py-6"
          >
            {/* Success Celebration Card */}
            <div className="bg-[#D4E2D4]/40 border border-[#CCD5AE] p-6 md:p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
              
              {/* Confetti decoration circles */}
              <div className="absolute top-2 left-6 bg-art-orange/10 w-8 h-8 rounded-full" />
              <div className="absolute top-12 right-10 bg-art-green-light/20 w-12 h-12 rounded-full" />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 bg-art-orange text-white rounded-full flex items-center justify-center shadow-md mb-4"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>

              <p className="font-serif font-black italic tracking-widest text-xl uppercase text-art-terracotta">{currentChallenge.nameEn}</p>
              <h3 className="font-serif font-black text-art-navy text-2xl mt-1 mb-2">Excellent! 答对了！</h3>
              
              <div className="bg-white/90 border border-[#E6E2D1] px-5 py-3.5 rounded-2xl shadow-inner mb-6 text-sm">
                <p className="font-sans font-medium text-art-sage">{currentChallenge.praiseText}</p>
                <p className="font-mono text-xs text-slate-500 mt-1.5">
                  核心句跟读: <span className="font-bold text-art-orange">{currentChallenge.nameEn} ({currentChallenge.nameZh})</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={speakPraise}
                  className="px-5 py-2.5 bg-art-cream hover:bg-art-green-pale/40 text-art-navy border border-[#E6E2D1] rounded-full font-sans text-sm font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Volume2 className="w-4 h-4" /> 听发音
                </button>

                <button
                  onClick={nextQuestion}
                  className="px-6 py-2.5 bg-art-orange hover:bg-art-terracotta text-white rounded-full shadow-lg font-sans font-bold text-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                >
                  下一关 <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Glowing star sparkles */}
              <AnimatePresence>
                {showCelebration && (
                  <motion.div
                    className="absolute inset-0 bg-art-orange/10 pointer-events-none flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 2 }}
                  >
                    <Sparkles className="text-yellow-400 w-32 h-32 animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {gameState === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 px-4 flex flex-col items-center w-full max-w-lg"
          >
            {/* Master Certificate Award Box */}
            <div className="bg-art-cream border-2 border-art-green-pale/60 p-8 rounded-[2.5rem] shadow-2xl relative w-full flex flex-col items-center">
              
              <div className="absolute top-4 right-6 text-lg animate-ping">✨</div>
              <div className="absolute bottom-6 left-8 text-lg animate-ping">🌟</div>

              {/* Big Golden Medal badge */}
              <motion.div
                className="w-24 h-24 bg-art-orange rounded-full flex items-center justify-center shadow-lg relative mb-4 border-4 border-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Award className="w-12 h-12 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1 text-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                >
                  ⭐
                </motion.div>
              </motion.div>

              <h3 className="font-serif font-black text-art-navy text-3xl">小米起床启蒙小达人！</h3>
              <p className="font-sans text-[10px] text-art-sage mt-1 uppercase tracking-widest font-bold">Good Morning Mia Master Certificate 📜</p>
              
              <div className="border-t border-b border-[#E6E2D1]/60 py-4 my-4 w-full">
                <p className="font-sans text-sm text-art-text font-medium leading-relaxed text-balance">
                  哇！你成功通过了 5 关全部挑战，找到了所有的核心物件！新一天的英语大门已经为你打开！
                </p>
                <div className="mt-2.5 flex justify-center gap-1.5 text-2xl">
                  <span>⭐⭐⭐⭐⭐</span>
                </div>
              </div>

              {/* Coins summary */}
              <p className="font-sans text-art-navy font-bold mb-6 text-sm">
                获得能量积分：<span className="text-xl text-art-orange font-mono">+{scoreCoins} XP</span> | 错误：{wrongCount === 0 ? '全对！你太棒啦！' : `${wrongCount} 次`}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-white hover:bg-art-green-pale/30 text-art-navy border border-[#E6E2D1] rounded-full font-sans text-sm font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" /> 重新玩
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
