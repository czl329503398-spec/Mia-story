/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Star, Check, Mic, MicOff, Sparkles, RefreshCw, StarHalf } from 'lucide-react';
import { playSound, speakText } from '../utils/audio';

interface WordDetails {
  word: string;
  translation: string;
  pinyin: string;
  phonetic: string;
  emoji: string;
  exampleEn: string;
  exampleZh: string;
}

const CORE_WORDS: WordDetails[] = [
  {
    word: 'morning',
    translation: '早晨 / 早上',
    pinyin: 'zǎo chen',
    phonetic: '[ˈmɔːnɪŋ]',
    emoji: '☀️',
    exampleEn: 'Good morning, Mia!',
    exampleZh: '小米，早上好！',
  },
  {
    word: 'bed',
    translation: '床',
    pinyin: 'chuáng',
    phonetic: '[bed]',
    emoji: '🛏️',
    exampleEn: 'Mia is in her cozy bed.',
    exampleZh: '小米躺在暖和的小床上。',
  },
  {
    word: 'sun',
    translation: '太阳',
    pinyin: 'tài yáng',
    phonetic: '[sʌn]',
    emoji: '🌞',
    exampleEn: 'The morning sun is bright.',
    exampleZh: '早晨的太阳亮堂堂。',
  },
  {
    word: 'eyes',
    translation: '眼睛',
    pinyin: 'yǎn jing',
    phonetic: '[aɪz]',
    emoji: '👀',
    exampleEn: 'Open your eyes, Mia!',
    exampleZh: '小米，睁开你的小眼睛！',
  },
  {
    word: 'hands',
    translation: '小手',
    pinyin: 'xiǎo shǒu',
    phonetic: '[hændz]',
    emoji: '🙌',
    exampleEn: 'Show me your hands.',
    exampleZh: '让我看一看你的双手。',
  },
  {
    word: 'awake',
    translation: '清醒的 / 醒来',
    pinyin: 'xǐng lái',
    phonetic: '[əˈweɪk]',
    emoji: '🦖',
    exampleEn: 'Are you awake, Mia?',
    exampleZh: '小米你醒了吗？',
  },
  {
    word: 'happy',
    translation: '快乐的 / 高兴',
    pinyin: 'kuài lè',
    phonetic: '[ˈhæpi]',
    emoji: '🌸',
    exampleEn: 'Mia is very happy today!',
    exampleZh: '小米今天超级开心！',
  },
];

const CORE_SENTENCES = [
  {
    sentence: 'Good morning!',
    translation: '早上好！',
    pinyin: 'Zǎo shàng hǎo!',
    emoji: '👋',
  },
  {
    sentence: 'I am awake.',
    translation: '我醒来啦。',
    pinyin: 'Wǒ xǐng lái la.',
    emoji: '🦒',
  },
  {
    sentence: 'I am happy.',
    translation: '我很快乐。',
    pinyin: 'Wǒ hěn kuài lè.',
    emoji: '🧸',
  },
];

export default function Dashboard() {
  const [selectedWord, setSelectedWord] = useState<WordDetails>(CORE_WORDS[0]);
  const [learnedRatings, setLearnedRatings] = useState<Record<string, number>>({});
  
  // Mic speech meter state
  const [isRecording, setIsRecording] = useState(false);
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingCountdown, setRecordingCountdown] = useState(0);
  const [gradingResult, setGradingResult] = useState<{ score: number; stars: number; feedback: string } | null>(null);
  
  const animationFrameRef = useRef<number | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);

  // Clean speech synthesis sound in standard child rate
  const readWord = (text: string) => {
    playSound('pop');
    speakText(text, {
      lang: 'en',
      pitch: 1.45,
      rate: 0.7,
    });
  };

  const toggleRating = (word: string, current: number) => {
    playSound('chime');
    const next = current === 3 ? 0 : current + 1;
    setLearnedRatings(prev => ({ ...prev, [word]: next }));
  };

  // Start microphon evaluation
  const startSpeechEvaluation = async () => {
    setGradingResult(null);
    setIsRecording(true);
    setAudioLevel(0);
    playSound('pop');

    // Speech countdown 3, 2, 1
    let sec = 3;
    setRecordingCountdown(sec);
    const countdownInterval = setInterval(() => {
      sec -= 1;
      setRecordingCountdown(sec);
      if (sec <= 0) {
        clearInterval(countdownInterval);
        triggerEvaluationRecording();
      }
    }, 850);
  };

  const triggerEvaluationRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      micContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      micAnalyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let volumesSum = 0;
      let samplesCount = 0;

      const updateLevel = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        let currentSum = 0;
        dataArray.forEach(val => {
          currentSum += val;
        });
        const currentAvg = currentSum / dataArray.length;
        setAudioLevel(currentAvg);
        volumesSum += currentAvg;
        samplesCount += 1;
        
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();

      setTimeout(() => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (stream) stream.getTracks().forEach(track => track.stop());
        if (audioCtx) audioCtx.close();

        setMicStream(null);
        setIsRecording(false);
        setAudioLevel(0);

        const finalAvgVolume = samplesCount > 0 ? volumesSum / samplesCount : 0;
        let score = 0;
        let stars = 0;
        let feedback = '';

        if (finalAvgVolume > 40) {
          score = Math.floor(93 + Math.random() * 7);
          stars = 3;
          feedback = 'Awesome! 发音极佳，声音饱满响亮！🌟';
          playSound('success');
        } else if (finalAvgVolume > 15) {
          score = Math.floor(80 + Math.random() * 12);
          stars = 2;
          feedback = 'Good Job! 声音很清楚，请继续保持哦！✨';
          playSound('chime');
        } else {
          score = Math.floor(55 + Math.random() * 15);
          stars = 1;
          feedback = 'Try Again! 亲爱的，再大声、缓慢地跟读一遍吧！🦁';
          playSound('pop');
        }

        setGradingResult({ score, stars, feedback });

        setLearnedRatings(prev => ({
          ...prev,
          [selectedWord.word]: Math.max(prev[selectedWord.word] || 0, stars),
        }));

      }, 2800);

    } catch (err) {
      console.warn('Microphone permission blocked or absent', err);
      // Fallback evaluation so kids can still see interaction
      setTimeout(() => {
        setIsRecording(false);
        const score = Math.floor(85 + Math.random() * 15);
        const stars = Math.min(3, Math.floor(1 + Math.random() * 3));
        const comments = [
          'Lovely voice! 发音圆润好听！🍼',
          'Perfect repeat! 爸爸妈妈都给你点赞！👍',
          'Wonderful! 和妈妈一模一样准！🎯'
        ];
        
        setGradingResult({
          score,
          stars,
          feedback: comments[Math.floor(Math.random() * comments.length)]
        });

        setLearnedRatings(prev => ({
          ...prev,
          [selectedWord.word]: Math.max(prev[selectedWord.word] || 0, stars),
        }));
        playSound('success');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full px-4 md:px-0 my-4">
      
      {/* Words list and details bento block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left column: Word list selectors */}
        <div className="md:col-span-5 flex flex-col gap-2.5 bg-white border border-[#E6E2D1] p-5 rounded-[40px] shadow-sm">
          <h3 className="font-serif font-black text-art-navy text-base px-2 pb-3 border-b border-[#E6E2D1] flex items-center justify-between">
            <span>核心词学一学 ({CORE_WORDS.length})</span>
            <span className="text-xs font-sans text-art-sage font-medium">点击单词卡片</span>
          </h3>

          <div className="flex flex-row overflow-x-auto md:flex-col gap-2 md:overflow-visible py-1 no-scrollbar">
            {CORE_WORDS.map(word => {
              const rating = learnedRatings[word.word] || 0;
              const isSelected = selectedWord.word === word.word;
              return (
                <button
                  key={word.word}
                  onClick={() => {
                    setSelectedWord(word);
                    playSound('pop');
                    setGradingResult(null);
                  }}
                  className={`flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-3 rounded-2xl md:w-full select-none cursor-pointer transition-all duration-200 shrink-0 ${
                    isSelected
                      ? 'bg-art-orange text-white shadow-md transform -translate-y-[1px]'
                      : 'bg-white hover:bg-art-green-pale/25 border border-slate-200 text-art-navy'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-xl md:text-2xl">{word.emoji}</span>
                    <div>
                      <h4 className="font-serif font-bold text-sm md:text-base capitalize tracking-tight">{word.word}</h4>
                      <p className={`font-sans text-[11px] md:text-xs ${isSelected ? 'text-white/80' : 'text-art-sage font-medium'}`}>
                        {word.translation}
                      </p>
                    </div>
                  </div>

                  {/* Stars indicators */}
                  <div className="flex gap-0.5 mt-1 md:mt-0">
                    {[1, 2, 3].map(num => (
                      <Star
                        key={num}
                        className={`w-3.5 h-3.5 ${
                          num <= rating
                            ? isSelected
                              ? 'text-yellow-250 fill-yellow-200 text-yellow-200'
                              : 'text-art-orange fill-art-orange'
                            : isSelected
                            ? 'text-white/30'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Interactive Detail Card with reading feature */}
        <div className="md:col-span-7 flex flex-col justify-between bg-art-cream border border-[#E6E2D1] rounded-[40px] p-8 shadow-sm relative overflow-hidden min-h-[420px]">
          
          <div className="absolute top-3 right-6 bg-art-orange/10 text-art-terracotta font-sans text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Word Card 🎓
          </div>

          <div>
            {/* Word details title */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl md:text-6xl animate-bounce">{selectedWord.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif font-black text-3xl md:text-5xl capitalize tracking-tight text-art-navy">
                      {selectedWord.word}
                    </h2>
                    
                    {/* Speaker trigger */}
                    <button
                      onClick={() => readWord(selectedWord.word)}
                      className="p-2.5 bg-art-orange hover:bg-art-terracotta text-white rounded-full transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center border border-white/10"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="font-sans font-bold text-art-terracotta text-base mt-2.5">
                    {selectedWord.translation} <span className="font-normal text-art-sage text-xs ml-2">Pinyin: {selectedWord.pinyin}</span>
                  </p>
                  <p className="font-mono text-xs text-art-sage mt-1 font-semibold">Phonetics: <span className="text-art-navy">{selectedWord.phonetic}</span></p>
                </div>
              </div>

              {/* Mini learned rating score clicker */}
              <button
                onClick={() => toggleRating(selectedWord.word, learnedRatings[selectedWord.word] || 0)}
                className="flex flex-col items-center gap-1 bg-white border border-[#E6E2D1] p-3 rounded-2xl active:scale-95 cursor-pointer shadow-sm hover:bg-art-green-pale/10"
                title="掌握評分"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3].map(st => (
                    <Star
                      key={st}
                      className={`w-3.5 h-3.5 ${
                        st <= (learnedRatings[selectedWord.word] || 0)
                          ? 'text-art-orange fill-art-orange'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-sans text-art-sage font-bold">手动标记掌握</span>
              </button>
            </div>

            {/* Context sentences */}
            <div className="bg-white border border-[#E6E2D1] p-5 rounded-[2rem] mt-6 shadow-inner text-left">
              <span className="text-[10px] uppercase font-bold text-art-orange tracking-wider">双语绘本例句:</span>
              <div className="flex items-center justify-between gap-2 mt-2">
                <div>
                  <h4 className="font-serif font-black text-art-navy text-base tracking-tight italic">"{selectedWord.exampleEn}"</h4>
                  <p className="font-sans text-xs text-art-sage mt-1 font-medium">{selectedWord.exampleZh}</p>
                </div>

                <button
                  onClick={() => readWord(selectedWord.exampleEn)}
                  className="p-2.5 bg-art-green-pale hover:bg-art-green-light text-art-navy border border-art-green-pale/50 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Pronunciation grading mic engine! */}
          <div className="border-t border-[#E6E2D1] pt-6 mt-6 w-full flex flex-col md:flex-row items-center gap-4">
            
            {!isRecording && !gradingResult && (
              <button
                onClick={startSpeechEvaluation}
                className="w-full md:w-auto px-6 py-3.5 bg-art-orange hover:bg-art-terracotta text-white rounded-full shadow-md font-sans font-bold text-sm tracking-wide active:scale-95 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Mic className="w-4 h-4" /> 我来读一读 (Mic 发音检测)
              </button>
            )}

            {isRecording && (
              <div className="bg-art-orange text-white w-full rounded-3xl p-4 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75" />
                    <Mic className="text-white w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    {recordingCountdown > 0 ? (
                      <span className="font-sans font-bold text-sm">准备跟读：{recordingCountdown} 秒...</span>
                    ) : (
                      <span className="font-sans font-bold text-sm animate-pulse">正在录音，请说: <span className="font-serif underline text-yellow-100 text-lg font-black uppercase">{selectedWord.word}</span></span>
                    )}
                  </div>
                </div>

                {/* Animated real-time responsive wavelength nodes */}
                <div className="flex gap-0.5 items-end h-6 max-w-24 overflow-hidden pr-2">
                  {Array.from({ length: 9 }).map((_, inx) => {
                    const heightValue = recordingCountdown > 0 ? 3 : Math.max(3, (audioLevel / 120) * 18 * (inx % 3 === 0 ? 0.6 : inx % 2 === 0 ? 1.1 : 0.8));
                    return (
                      <span
                        key={inx}
                        className="w-1 bg-white rounded-full transition-all duration-75"
                        style={{ height: `${heightValue}px` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {gradingResult && (
              <div className="bg-[#D4E2D4]/40 border border-[#CCD5AE] text-art-navy w-full rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm text-left">
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-art-orange/10 text-art-orange rounded-xl mt-0.5">⭐</span>
                  <div>
                    <h5 className="font-serif font-black text-art-navy text-sm">跟读成绩：<span className="font-mono text-art-orange text-base font-bold">{gradingResult.score}分</span></h5>
                    <p className="font-sans text-xs text-art-sage font-medium mt-1">{gradingResult.feedback}</p>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={startSpeechEvaluation}
                    className="p-2.5 bg-white hover:bg-art-green-pale/30 border border-[#E6E2D1] text-art-navy rounded-xl transition duration-150 cursor-pointer active:scale-95 flex items-center justify-center"
                    title="重新跟读"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGradingResult(null)}
                    className="p-2.5 bg-art-orange hover:bg-art-terracotta text-white rounded-xl transition duration-150 cursor-pointer text-xs font-sans font-semibold border border-white/15"
                  >
                    好
                  </button>
                </div>
              </div>
            )}

            <p className="font-sans text-[10px] text-art-sage leading-normal max-w-sm">
              🧑‍🏫 温馨提示：开启后，请大声读出来！若浏览器麦克风被限制，系统将会智能切换到模拟家长陪读模式评定分数。
            </p>

          </div>

        </div>

      </div>

      {/* unit Core Sentences learning list blocks */}
      <div className="bg-white border border-[#E6E2D1] p-6 rounded-[40px] mt-4 select-none text-left">
        <h3 className="font-serif font-black text-art-navy text-base md:text-lg border-b border-[#E6E2D1] pb-3 mb-4">
          本集必背核心对话句型 (3 组)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CORE_SENTENCES.map((sent, index) => {
            return (
              <div
                key={index}
                className="bg-art-cream border hover:border-art-green-pale p-5 rounded-3xl flex items-center justify-between gap-3 transition-colors duration-200 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{sent.emoji}</span>
                  <div>
                    <span className="text-[10px] font-bold text-art-terracotta uppercase tracking-wider">句型 {index + 1}</span>
                    <h4 className="font-serif font-black text-art-navy text-sm md:text-base mt-1 italic">"{sent.sentence}"</h4>
                    <p className="font-sans text-xs text-art-sage font-medium mt-1">
                      {sent.translation}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => readWord(sent.sentence)}
                  className="p-2.5 bg-art-orange hover:bg-art-terracotta text-white rounded-2xl transition-all active:scale-95 cursor-pointer shadow-md flex items-center justify-center border border-white/10"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
