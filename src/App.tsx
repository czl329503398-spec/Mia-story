/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  Gamepad2,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Smile,
  Music,
  Info
} from 'lucide-react';
import { playSound, speakText, cancelSpeech } from './utils/audio';
import { Scene, PlayMode } from './types';
import IllustrationSVG from './components/IllustrationSVG';
import ReviewGame from './components/ReviewGame';
import Dashboard from './components/Dashboard';

// Define the 8 chronological story scenes corresponding to 60-75s pacing
const STORY_SCENES: Scene[] = [
  {
    id: 1,
    timeStart: 0,
    timeEnd: 8,
    title: '早上好，小米',
    narratorZh: '早上，太阳公公悄悄爬上天空。小米还躺在小床上，抱着她的小兔子。',
    motherSpokenZh: '早上好，起床啦！',
    characterSpokenEn: 'Good morning!',
    characterSpokenZh: '早上好！',
    repeats: ['Good morning, Mia!', 'Good morning!'],
    coreWords: ['morning', 'bed', 'sun'],
    animationTrigger: 'sleep',
  },
  {
    id: 2,
    timeStart: 8,
    timeEnd: 16,
    title: '温馨的房间',
    narratorZh: '妈妈轻轻走进房间，温柔地看着睡眼惺忪的小米。',
    motherSpokenZh: '早上好，小米！',
    characterSpokenEn: 'Good morning, Mia!',
    characterSpokenZh: '早上好，小米！',
    repeats: ['Good morning, Mia!', 'Good morning!'],
    coreWords: ['morning'],
    animationTrigger: 'mother_enters',
  },
  {
    id: 3,
    timeStart: 16,
    timeEnd: 24,
    title: '假装在睡觉',
    narratorZh: '小米把小脸藏进暖和的被子里，假装还在呼呼大睡。妈妈笑着问她。',
    motherSpokenZh: '小米，你睁开眼了吗？你醒了吗？',
    characterSpokenEn: 'Are you awake?',
    characterSpokenZh: '你醒了吗？',
    repeats: ['Are you awake, Mia?', 'Are you awake?'],
    coreWords: ['bed', 'awake'],
    animationTrigger: 'peek_blanket',
  },
  {
    id: 4,
    timeStart: 24,
    timeEnd: 32,
    title: '闪亮大眼睛',
    narratorZh: '小米慢慢睁开圆溜溜的眼睛，指着大眼睛神气地说。',
    motherSpokenZh: '对，睁开你的眼睛吧。',
    characterSpokenEn: 'Eyes! My eyes!',
    characterSpokenZh: '眼睛！我的眼睛！',
    repeats: ['Eyes! My eyes!', 'Open your eyes.'],
    coreWords: ['eyes'],
    animationTrigger: 'eyes_open',
  },
  {
    id: 5,
    timeStart: 32,
    timeEnd: 40,
    title: '向太阳招手',
    narratorZh: '小米看见窗外亮堂堂的太阳，挥挥她的小手说。',
    motherSpokenZh: '太阳公公在笑呢。',
    characterSpokenEn: 'Good morning, sun!',
    characterSpokenZh: '早上好，太阳公公！',
    repeats: ['Good morning, sun!', 'Good morning, sun!'],
    coreWords: ['sun', 'morning'],
    animationTrigger: 'wave_sun',
  },
  {
    id: 6,
    timeStart: 40,
    timeEnd: 48,
    title: '伸出小双手',
    narratorZh: '妈妈笑着对小米说：伸出两只小手。小米快乐地伸出来。',
    motherSpokenZh: '让我看看你的小手。',
    characterSpokenEn: 'Hands! My hands!',
    characterSpokenZh: '手！我的双手！',
    repeats: ['Hands! My hands!', 'Show me your hands.'],
    coreWords: ['hands'],
    animationTrigger: 'show_hands',
  },
  {
    id: 7,
    timeStart: 48,
    timeEnd: 56,
    title: '小米醒啦！',
    narratorZh: '妈妈大声问：小米现在你睡醒了吗？小米骨碌一下坐起来！',
    motherSpokenZh: '小米，你醒了吗？',
    characterSpokenEn: 'I am awake!',
    characterSpokenZh: '我快醒啦 / 我睡醒啦！',
    repeats: ['I am awake!', 'I am awake!'],
    coreWords: ['awake'],
    animationTrigger: 'sit_up',
  },
  {
    id: 8,
    timeStart: 56,
    timeEnd: 65,
    title: '新的一天开始!',
    narratorZh: '妈妈温柔问：你今天开心吗？小米抱着喜爱的白色小兔子，甜甜地说。新的一天开始啦！',
    motherSpokenZh: '你开心吗？',
    characterSpokenEn: 'I am happy!',
    characterSpokenZh: '我很快乐 / 我很开心！',
    repeats: ['I am happy!', 'I am happy!'],
    coreWords: ['happy', 'bed'],
    animationTrigger: 'happy_hug',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<PlayMode>('video');
  
  // Custom Video playback state (0s - 65s duration timeline)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(65);
  const [isNarratorOn, setIsNarratorOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);

  // Soft Background Lullaby synth loop state
  const [isBgMusicOn, setIsBgMusicOn] = useState(false);
  
  // Ref tracking timing variables
  const timelineIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenSceneIdRef = useRef<number | null>(null);

  // Interactive story book reader page state
  const [storybookPage, setStorybookPage] = useState(1);

  // Synced state tracking what Mia is "saying / pronouncing" dynamically for highlighting subtitles
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);

  // Trigger sound synthesis on startup
  useEffect(() => {
    playSound('morning');
  }, []);

  // Background nursery chimes composer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isBgMusicOn && !isMuted) {
      const melodyFreqs = [261.63, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00]; // C, E, G, A, C5
      let stepIdx = 0;

      const playNextSynthChime = () => {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.frequency.setValueAtTime(melodyFreqs[stepIdx % melodyFreqs.length], audioCtx.currentTime);
          gain.gain.setValueAtTime(0, audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.1); // Extremely soft background ambient
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

          osc.start();
          osc.stop(audioCtx.currentTime + 1.4);
          
          // Next melody track step
          stepIdx += 1;
          timer = setTimeout(playNextSynthChime, 1500);
        } catch (_) {}
      };

      playNextSynthChime();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isBgMusicOn, isMuted]);

  // Video timeline counter mechanics
  useEffect(() => {
    if (isPlaying) {
      timelineIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            playSound('chime');
            return 0; // wrap timeline
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    }

    return () => {
      if (timelineIntervalRef.current) clearInterval(timelineIntervalRef.current);
    };
  }, [isPlaying, duration]);

  // Active scene mapper based on current time
  useEffect(() => {
    const matchedIndex = STORY_SCENES.findIndex(
      (s) => currentTime >= s.timeStart && currentTime < s.timeEnd
    );
    if (matchedIndex !== -1) {
      setActiveSegmentIndex(matchedIndex);
    }
  }, [currentTime]);

  // TTS Narrator synchronizer - Speaks Chinese narrative and repeats English sentences twice
  useEffect(() => {
    if (activeTab !== 'video' || !isNarratorOn || isMuted) {
      return;
    }

    const currentScene = STORY_SCENES[activeSegmentIndex];
    if (lastSpokenSceneIdRef.current === currentScene.id) {
      return; // Already triggered this scene's speech
    }

    lastSpokenSceneIdRef.current = currentScene.id;

    // Build sequential speech pipeline
    setSpeechBubbleText(null);

    // 1. Mom's Chinese narrative voice helper
    speakText(currentScene.narratorZh, {
      lang: 'zh',
      rate: 0.95,
      pitch: 1.0,
      onStart: () => {
        setSpeechBubbleText('📖 旁白阅读中...');
      },
      onEnd: () => {
        // 2. Introduce Core English Sentence (1st Repeat)
        setTimeout(() => {
          speakText(currentScene.repeats[0], {
            lang: 'en',
            rate: 0.72,
            pitch: 1.45,
            onStart: () => {
              setSpeechBubbleText(`🗣️ Mia: "${currentScene.repeats[0]}"`);
              playSound('chime');
            },
            onEnd: () => {
              // 3. Repeat English Sentence (2nd Repeat)
              setTimeout(() => {
                speakText(currentScene.repeats[1], {
                  lang: 'en',
                  rate: 0.75,
                  pitch: 1.45,
                  onStart: () => {
                    setSpeechBubbleText(`🗣️ Mia (跟读): "${currentScene.repeats[1]}"`);
                    playSound('pop');
                  },
                  onEnd: () => {
                    setSpeechBubbleText(null);
                  },
                });
              }, 1200); // 1.2s break for child to sink it in
            },
          });
        }, 800);
      },
    });

    return () => {
      cancelSpeech();
    };
  }, [activeSegmentIndex, isNarratorOn, isMuted, activeTab]);

  // Stop speeches if tabs swap
  useEffect(() => {
    cancelSpeech();
    setSpeechBubbleText(null);
  }, [activeTab]);

  const activeScene = STORY_SCENES[activeSegmentIndex];

  // Story book read button trigger
  const readStorybookPage = (scene: Scene) => {
    playSound('pop');
    setSpeechBubbleText(null);

    speakText(scene.narratorZh, {
      lang: 'zh',
      rate: 0.95,
      pitch: 1.0,
      onStart: () => setSpeechBubbleText('📖 妈妈讲故事中...'),
      onEnd: () => {
        setTimeout(() => {
          speakText(scene.repeats[0], {
            lang: 'en',
            rate: 0.7,
            pitch: 1.45,
            onStart: () => setSpeechBubbleText(`🗣️ Mia: "${scene.repeats[0]}"`),
            onEnd: () => {
              setTimeout(() => {
                speakText(scene.repeats[1], {
                  lang: 'en',
                  rate: 0.75,
                  pitch: 1.45,
                  onStart: () => setSpeechBubbleText(`🗣️ Mia: "${scene.repeats[1]}"`),
                  onEnd: () => setSpeechBubbleText(null),
                });
              }, 1500);
            },
          });
        }, 1000);
      },
    });
  };

  return (
    <div className="min-h-screen bg-art-ivory text-art-text pb-16 font-sans">
      
      {/* Top Header - Warm children theme */}
      <header className="sticky top-0 z-50 bg-[#FFFCF0]/90 backdrop-blur-md border-b border-[#E6E2D1] px-4 py-4 shadow-sm select-none">
        <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <span className="p-2.5 bg-art-orange text-white rounded-full shadow-md transform -rotate-2 animate-pulse flex items-center justify-center">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-art-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">启蒙第一季</span>
                <span className="text-xs font-mono text-art-sage font-bold">Level: Zero-to-One</span>
              </div>
              <h1 className="font-serif font-black text-art-navy text-lg md:text-2xl tracking-tight mt-1">
                Mia's English Adventure <span className="text-art-orange text-base font-normal italic">- Episode 01</span>
              </h1>
            </div>
          </div>

          {/* Navigation selectors for children */}
          <nav className="flex items-center gap-1.5 bg-art-green-pale/50 p-1.5 rounded-2xl border border-art-green-pale font-sans font-bold text-xs shadow-inner">
            <button
              onClick={() => {
                setActiveTab('video');
                playSound('pop');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                activeTab === 'video' ? 'bg-art-orange text-white shadow-md' : 'text-art-sage hover:bg-art-green-light/40'
              }`}
            >
              🎬 绘本影院
            </button>
            <button
              onClick={() => {
                setActiveTab('interactive');
                playSound('pop');
                setStorybookPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                activeTab === 'interactive' ? 'bg-art-orange text-white shadow-md' : 'text-art-sage hover:bg-art-green-light/40'
              }`}
            >
              📖 亲子点读
            </button>
            <button
              onClick={() => {
                setActiveTab('game');
                playSound('pop');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                activeTab === 'game' ? 'bg-art-orange text-white shadow-md' : 'text-art-sage hover:bg-art-green-light/40'
              }`}
            >
              🎮 早安指一指
            </button>
            <button
              onClick={() => {
                setActiveTab('dictionary');
                playSound('pop');
              }}
              className={`px-4 py-2.5 rounded-xl transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                activeTab === 'dictionary' ? 'bg-art-orange text-white shadow-md' : 'text-art-sage hover:bg-art-green-light/40'
              }`}
            >
              🦁 单词看板
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-6">

        <AnimatePresence mode="wait">
          
          {/* 1. CINEMA VIDEO PLAYER */}
          {activeTab === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              {/* Cinema Theater Frame - Picture Book Style */}
              <div className="w-full max-w-4xl bg-[#FFFDF0] p-0 overflow-hidden relative">
                
                {/* 16:9 Screen */}
                <div className="relative aspect-video w-full rounded-[40px] shadow-2xl overflow-hidden border-8 border-white bg-art-cream select-none">
                  
                  {/* Decorative gadget dots matching Artistic Flair design overlay */}
                  <div className="absolute top-6 left-6 flex gap-2 z-10">
                    <div className="w-3 h-3 rounded-full bg-art-terracotta"></div>
                    <div className="w-3 h-3 rounded-full bg-art-orange"></div>
                    <div className="w-3 h-3 rounded-full bg-art-green-light"></div>
                  </div>

                  {/* The Vector Illustration screen backdrop */}
                  <IllustrationSVG sceneId={activeScene.id} />

                  {/* Character/Speech voice indicator banner */}
                  {speechBubbleText && (
                    <div className="absolute top-6 right-6 bg-art-orange/90 text-white font-sans font-black text-xs md:text-sm px-4 py-2 rounded-2xl shadow-md border border-white/20 max-w-[280px] z-10">
                      {speechBubbleText}
                    </div>
                  )}

                  {/* Scene name badge */}
                  <div className="absolute top-6 left-24 bg-art-navy/80 text-art-green-pale font-mono text-[10px] md:text-xs font-bold px-3 py-1 rounded-full border border-art-green-pale/20 z-10">
                     Scene {activeScene.id}: {activeScene.title}
                  </div>

                  {/* Inline double lines subtitle */}
                  <div className="absolute bottom-6 left-4 right-4 md:left-12 md:right-12 z-10">
                    <div className="bg-white/80 backdrop-blur-md p-4 md:p-6 rounded-3xl text-center shadow-lg border border-art-green-pale/30">
                      
                      {/* EN translation */}
                      <p className="font-serif font-black text-lg md:text-3xl text-art-navy tracking-wide leading-tight uppercase italic">
                        {activeScene.characterSpokenEn}
                      </p>
                      
                      {/* ZH translation */}
                      <p className="font-sans font-medium text-xs md:text-lg text-art-sage mt-1.5 tracking-wide">
                        {activeScene.characterSpokenZh}
                      </p>

                      {/* Word spotlight bubble trigger */}
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {activeScene.coreWords.map((word) => (
                          <span
                            key={word}
                            onClick={() => {
                              playSound('pop');
                              speakText(word, { lang: 'en', pitch: 1.4, rate: 0.75 });
                            }}
                            className="bg-art-orange hover:bg-art-terracotta text-white font-mono text-[10px] md:text-xs font-bold px-3 py-1 rounded-full shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all text-center flex items-center gap-1 border border-white/20"
                          >
                            ⭐ Spotlight: <span className="underline uppercase tracking-wider">{word}</span> 🔈
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Progress bar alignment inside container */}
                <div className="mt-6 px-1">
                  <div className="bg-white rounded-full p-1.5 shadow-sm flex items-center border border-art-green-pale/30">
                    <div 
                      className="h-3.5 bg-art-orange rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div className="-ml-2 w-5 h-5 bg-white border-4 border-art-orange rounded-full shadow-md cursor-pointer transition-transform hover:scale-110" />
                    <div className="flex-1 h-3.5 bg-art-cream rounded-full -ml-1" />
                  </div>
                </div>

                {/* Video Player Media Control Panel */}
                <div className="bg-white border border-[#E6E2D1] shadow-sm p-4 md:p-5 rounded-[2rem] mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  
                  {/* Left row: Play & reset triggers */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        playSound('pop');
                        setIsPlaying((p) => !p);
                      }}
                      className="p-3.5 bg-art-orange hover:bg-art-terracotta text-white rounded-full transition-all duration-150 shadow-md active:scale-95 cursor-pointer flex items-center justify-center"
                      title={isPlaying ? '暂停' : '播放'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                    </button>

                    <button
                      onClick={() => {
                        playSound('pop');
                        setCurrentTime(0);
                        lastSpokenSceneIdRef.current = null;
                      }}
                      className="p-3.5 bg-white border border-[#E6E2D1] text-art-navy rounded-full hover:bg-art-green-pale/20 transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center"
                      title="重头开始"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Current Pacing indicator */}
                    <div className="font-mono text-xs text-art-sage font-bold px-2">
                      {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 1:05
                    </div>
                  </div>

                  {/* Mid Row: Custom time click handler/slider progress */}
                  <div className="flex-1 w-full mx-2 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => {
                        const nextVal = parseInt(e.target.value, 10);
                        setCurrentTime(nextVal);
                        lastSpokenSceneIdRef.current = null; // force speech triggers
                      }}
                      className="w-full accent-art-orange cursor-pointer"
                    />
                  </div>

                  {/* Right Row: Narrator, Ambient, and sound controllers */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* Auto narrator voice */}
                    <button
                      onClick={() => {
                        playSound('pop');
                        setIsNarratorOn((prev) => !prev);
                        if (isNarratorOn) cancelSpeech();
                      }}
                      className={`px-3 py-2 rounded-xl border-b-4 font-sans text-xs font-bold transition duration-150 active:scale-95 cursor-pointer ${
                        isNarratorOn
                          ? 'bg-art-green-pale border-art-sage text-art-sage'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                      title="开启或关闭旁白发音"
                    >
                      🎙️ 旁白发音: {isNarratorOn ? '开' : '关'}
                    </button>

                    {/* Background Soft Rhyme Loops */}
                    <button
                      onClick={() => {
                        playSound('pop');
                        setIsBgMusicOn((prev) => !prev);
                      }}
                      className={`p-2.5 rounded-xl border-b-4 transition duration-150 active:scale-95 cursor-pointer ${
                        isBgMusicOn
                          ? 'bg-art-green-pale border-art-sage text-art-sage'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                      title="背景萌趣木琴乐"
                    >
                      <Music className={`w-4 h-4 ${isBgMusicOn ? 'animate-bounce' : ''}`} />
                    </button>

                    {/* All sound controller */}
                    <button
                      onClick={() => {
                        playSound('pop');
                        setIsMuted((prev) => !prev);
                        if (!isMuted) cancelSpeech();
                      }}
                      className={`p-2.5 rounded-xl border-b-4 transition-all cursor-pointer ${
                        isMuted ? 'bg-red-50 border-red-300 text-red-600' : 'bg-white border-slate-200 text-art-navy shadow-sm'
                      }`}
                      title={isMuted ? '取消静音' : '静音'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

                {/* Subtitle / Narrative Helper text underneath for parents co-reading */}
                <div className="bg-white border border-[#E6E2D1] rounded-[32px] p-6 mt-6 shadow-sm text-left flex items-start gap-4">
                  <span className="p-2 bg-art-green-pale text-art-sage rounded-xl flex items-center justify-center"><Smile className="w-5 h-5" /></span>
                  <div>
                    <h4 className="font-serif font-bold text-art-navy text-base">Parent's Co-Study Guide 👨‍👩‍👦</h4>
                    <p className="font-sans text-sm text-art-text leading-relaxed mt-1">
                      本节目标学习 core words：<span className="font-bold underline text-art-orange">morning, bed, sun, eyes, hands, happy, awake</span>。
                      请播放视频引导孩子轻声跟读英文部分，画面下方的 Spotlight 气泡支持随时点击反复拼读学习。
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 2. INTERACTIVE STORYBOOK MODE */}
          {activeTab === 'interactive' && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="bg-white border-8 border-white rounded-[40px] p-6 shadow-2xl w-full max-w-4xl relative overflow-hidden">
                
                {/* Book Header info */}
                <div className="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-[#E6E2D1] gap-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2.5 bg-art-orange text-white rounded-xl shadow-sm"><BookOpen className="w-5 h-5" /></span>
                    <h3 className="font-serif font-black text-art-navy text-base md:text-lg">亲子点读故事绘本 ({storybookPage}/8)</h3>
                  </div>
                  
                  {/* Speech alert */}
                  <div className="text-xs font-sans text-art-terracotta font-bold bg-art-cream px-3 py-1.5 rounded-full border border-[#E6E2D1] animate-pulse">
                    💡 点击画面中的太阳、床或小手，会有好玩的反馈喔！
                  </div>
                </div>

                {/* Page content wrapper side-by-side or stacked portrait */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 items-center">
                  
                  {/* Left Column: Widescreen SVG view area */}
                  <div className="md:col-span-7 aspect-video w-full rounded-[30px] border border-[#E6E2D1] bg-art-cream relative overflow-hidden shadow-inner">
                    <IllustrationSVG
                      sceneId={storybookPage}
                      onElementClick={(name) => {
                        playSound('pop');
                        
                        // speak specific word clicked sequentially: English then Chinese!
                        const wordEnMap: Record<string, string> = {
                          sun: 'sun',
                          bed: 'bed',
                          eyes: 'eyes',
                          hands: 'hands',
                          happy: 'happy',
                          awake: 'I am awake',
                        };

                        const wordZhMap: Record<string, string> = {
                          sun: '太阳',
                          bed: '小床',
                          eyes: '眼睛',
                          hands: '小手',
                          happy: '开心',
                          awake: '我醒来啦',
                        };

                        const enText = wordEnMap[name] || name;
                        const zhText = wordZhMap[name] || '';

                        // Speak English first
                        speakText(enText, {
                          lang: 'en',
                          pitch: 1.45,
                          rate: 0.72,
                          onEnd: () => {
                            if (zhText) {
                              setTimeout(() => {
                                speakText(zhText, {
                                  lang: 'zh',
                                  pitch: 1.05,
                                  rate: 0.95,
                                });
                              }, 350);
                            }
                          }
                        });

                        setSpeechBubbleText(`👉 点读: "${name.toUpperCase()}"`);
                        setTimeout(() => setSpeechBubbleText(null), 2500);
                      }}
                    />

                    {/* Speech annotation */}
                    {speechBubbleText && (
                      <div className="absolute top-4 right-4 bg-art-orange text-white font-sans font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg border border-white/20">
                        {speechBubbleText}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Narrative read text and translation */}
                  <div className="md:col-span-5 text-left bg-art-cream border border-[#E6E2D1] p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between min-h-[260px]">
                    <div>
                      <span className="text-xs bg-art-green-pale text-art-sage border border-art-green-light font-bold px-3 py-1 rounded-full">第 {storybookPage} 页</span>
                      
                      <p className="font-serif font-bold text-art-navy text-base md:text-lg leading-relaxed mt-4">
                        {STORY_SCENES[storybookPage - 1].narratorZh}
                      </p>

                      <div className="border-t border-[#E6E2D1]/60 pt-4 mt-4">
                        <span className="text-[10px] text-art-orange uppercase tracking-wider font-bold">核心英文输入句型:</span>
                        <h4 className="font-serif font-black text-art-terracotta text-lg md:text-2xl mt-1 tracking-tight italic">
                          "{STORY_SCENES[storybookPage - 1].characterSpokenEn}"
                        </h4>
                        <p className="font-sans text-xs text-art-sage mt-1 font-medium italic">
                          宝宝跟读：{STORY_SCENES[storybookPage - 1].characterSpokenZh}
                        </p>
                      </div>
                    </div>

                    {/* Audio & Page control buttons */}
                    <div className="flex gap-2.5 border-t border-[#E6E2D1]/60 pt-4 mt-4">
                      
                      {/* Hear speech synthesis read page */}
                      <button
                        onClick={() => readStorybookPage(STORY_SCENES[storybookPage - 1])}
                        className="px-5 py-2.5 bg-art-orange hover:bg-art-terracotta text-white rounded-full font-sans text-xs font-bold transition duration-150 active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
                        title="朗读本页"
                      >
                        <Volume2 className="w-4 h-4" /> 听发音 (重复2次)
                      </button>

                    </div>

                  </div>

                </div>

                {/* Bottom Story page turn handles */}
                <div className="flex items-center justify-between border-t border-[#E6E2D1] pt-6 mt-6 w-full select-none">
                  
                  <button
                    onClick={() => {
                      if (storybookPage > 1) {
                        setStorybookPage((p) => p - 1);
                        playSound('pop');
                      }
                    }}
                    disabled={storybookPage === 1}
                    className="px-5 py-2.5 bg-white hover:bg-art-green-pale/30 text-art-navy border border-[#E6E2D1] rounded-full font-sans text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" /> 上一页
                  </button>

                  {/* Dot sliders indicators */}
                  <div className="flex gap-2">
                    {STORY_SCENES.map((_s, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setStorybookPage(index + 1);
                          playSound('pop');
                        }}
                        className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                          storybookPage === index + 1 ? 'bg-art-orange scale-125 shadow-md' : 'bg-art-green-pale hover:bg-art-green-light'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (storybookPage < 8) {
                        setStorybookPage((p) => p + 1);
                        playSound('pop');
                      }
                    }}
                    disabled={storybookPage === 8}
                    className="px-5 py-2.5 bg-white hover:bg-art-green-pale/30 text-art-navy border border-[#E6E2D1] rounded-full font-sans text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                  >
                    下一页 <ChevronRight className="w-4 h-4" />
                  </button>

                </div>

              </div>
            </motion.div>
          )}

          {/* 3. POINT-AND-SEEK PLAY INTERFACE */}
          {activeTab === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <ReviewGame />
            </motion.div>
          )}

          {/* 4. DICTIONARY DASHBOARD */}
          {activeTab === 'dictionary' && (
            <motion.div
              key="dictionary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Dashboard />
            </motion.div>
          )}

        </AnimatePresence>

        {/* Informational footer co-study guide panel */}
        <div className="bg-[#E9EDC9]/25 px-6 py-5 border border-art-green-pale rounded-[32px] mt-12 text-left shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 max-w-4xl mx-auto w-full">
          <Info className="text-art-sage w-6 h-6 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="font-serif font-bold text-art-navy text-[13px]">家校合力 互动共读小游戏建议</h5>
            <p className="font-sans text-xs text-art-sage leading-relaxed mt-1">
              家长可以跟孩子说词汇：<strong>eyes, hands, sun, bed, happy</strong>，并引导孩子做相应动作：眨眨眼说 eyes; 伸手说 hands; 招招手说 good morning;
              让绘本启蒙学习成为全家开心、亲近的好时光！如有任何反馈或声音问题，可点选菜单上的 🎙️ 按钮重新发音。
            </p>
          </div>
        </div>

      </main>

    </div>
  );
}
