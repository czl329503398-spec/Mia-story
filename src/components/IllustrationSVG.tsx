/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface IllustrationProps {
  sceneId: number;
  interactive?: boolean;
  onElementClick?: (elementName: string) => void;
  gameTarget?: string; // Highlight target for the point-and-seek game
}

export default function IllustrationSVG({
  sceneId,
  interactive = false,
  onElementClick,
  gameTarget,
}: IllustrationProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [peekState, setPeekState] = useState(false); // Scene 3 hide & peek

  // Random eye blinking for Mia
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Trigger brief hand waving or bounce
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1500);
    }, 5000);
    return () => clearInterval(waveInterval);
  }, []);

  const handleEntityClick = (name: string) => {
    if (onElementClick) {
      onElementClick(name);
    }
  };

  // Helper filter/glow style for game target highlights
  const getHighlightPulse = (name: string) => {
    const isTarget = gameTarget === name;
    return isTarget
      ? {
          stroke: '#FBBF24',
          strokeWidth: 4,
          strokeDasharray: '6 4',
          className: 'animate-pulse cursor-pointer filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]',
        }
      : { className: 'cursor-pointer transition-all duration-300 hover:filter hover:brightness-105' };
  };

  // Render scenes based on id
  switch (sceneId) {
    case 1:
      // Scene 1: Morning, Sun rising, Mia sleeping with her bunny on a bed.
      return (
        <svg id="svg-scene-1" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-sky-100 overflow-hidden">
          {/* Sky & sun background */}
          <rect width="800" height="450" fill="url(#dawn-sky)" />
          
          {/* Rising Sun (Background) */}
          <g className="cursor-pointer" onClick={() => handleEntityClick('sun')} {...getHighlightPulse('sun')}>
            <circle cx="150" cy="180" r="45" fill="#FFE082" />
            <circle cx="150" cy="180" r="35" fill="#FFB300" />
            {/* Cute sleeping face for Sun */}
            <path d="M 140 180 Q 145 185 150 180" stroke="#FF6F00" strokeWidth="3" fill="none" />
            <path d="M 152 180 Q 157 185 162 180" stroke="#FF6F00" strokeWidth="3" fill="none" />
            <path d="M 147 175 Q 150 178 153 175" stroke="#FF6F00" strokeWidth="2" fill="none" />
          </g>

          {/* Mountains in background */}
          <path d="M 0 350 L 250 250 L 500 350 Z" fill="#C5D9E8" opacity="0.6" />
          <path d="M 300 350 L 600 230 L 800 350 Z" fill="#C5D9E8" opacity="0.5" />

          {/* Bedroom Wall Interior overlay */}
          <path d="M 280 450 L 280 100 L 800 100 L 800 450 Z" fill="#FFFBE6" stroke="#E3DFD5" strokeWidth="4" />
          
          {/* Big Window structure */}
          <rect x="30" y="50" width="220" height="180" rx="10" fill="none" stroke="#D7CCC8" strokeWidth="8" />
          <line x1="140" y1="50" x2="140" y2="230" stroke="#D7CCC8" strokeWidth="6" />
          <line x1="30" y1="140" x2="250" y2="140" stroke="#D7CCC8" strokeWidth="6" />
          
          {/* Cute Yellow Window Curtains */}
          <path d="M 25 45 Q 70 80 50 240 L 30 240 Z" fill="#FFF176" opacity="0.9" />
          <path d="M 255 45 Q 210 80 230 240 L 250 240 Z" fill="#FFF176" opacity="0.9" />

          {/* Cosy bed structure */}
          <g id="bed-group" className="cursor-pointer" onClick={() => handleEntityClick('bed')} {...getHighlightPulse('bed')}>
            {/* Wooden frame */}
            <rect x="340" y="320" width="410" height="100" rx="15" fill="#A1887F" />
            <rect x="320" y="260" width="30" height="160" rx="5" fill="#8D6E63" />
            <rect x="740" y="300" width="25" height="120" rx="5" fill="#8D6E63" />
            {/* Mattress */}
            <rect x="350" y="310" width="390" height="40" rx="10" fill="#E0F7FA" />
            {/* Sheet pattern */}
            <path d="M 350 325 Q 400 330 450 325 T 550 325 T 650 325 T 740 325" stroke="#B2EBF2" strokeWidth="2" fill="none" />
          </g>

          {/* Giant Pink Pillow */}
          <rect x="350" y="270" width="110" height="55" rx="20" fill="#F8BBD0" />
          <ellipse cx="405" cy="297" rx="45" ry="18" fill="#F48FB1" />

          {/* Sleeping Mia */}
          <g id="sleeping-mia">
            {/* Sleeping face */}
            <ellipse cx="460" cy="280" rx="35" ry="32" fill="#FFE0B2" />
            {/* Black hair */}
            <path d="M 425 275 Q 460 230 495 275 Q 498 300 485 312 L 435 312 Z" fill="#212121" />
            {/* Cheek rosy glow */}
            <circle cx="440" cy="290" r="8" fill="#FF8A80" opacity="0.6" />
            {/* Closed eye */}
            <path d="M 442 280 Q 448 285 454 280" stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Sweet closed mouth */}
            <path d="M 452 295 Q 456 298 460 295" stroke="#E64A19" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            
            {/* Blanket covering her body */}
            <path d="M 475 295 C 475 295 500 290 530 295 C 570 300 680 290 730 300 L 730 370 L 470 370 Z" fill="#80CBC4" />
            
            {/* Bunny toy tucked in her arm */}
            <g id="bunny-toy" className="cursor-pointer" onClick={() => handleEntityClick('happy')} {...getHighlightPulse('happy')}>
              {/* Ears */}
              <ellipse cx="485" cy="265" rx="7" ry="22" fill="#ECEFF1" transform="rotate(-15, 485, 265)" />
              <ellipse cx="485" cy="265" rx="4" ry="16" fill="#FFCDD2" transform="rotate(-15, 485, 265)" />
              
              <ellipse cx="505" cy="270" rx="7" ry="22" fill="#ECEFF1" transform="rotate(10, 505, 270)" />
              <ellipse cx="505" cy="270" rx="4" ry="16" fill="#FFCDD2" transform="rotate(10, 505, 270)" />

              {/* Head */}
              <circle cx="498" cy="290" r="16" fill="#FFFFFF" />
              <circle cx="503" cy="293" r="4" fill="#FF8A80" opacity="0.6" />
              {/* Eyes */}
              <circle cx="493" cy="287" r="1.5" fill="#37474F" />
              <circle cx="501" cy="288" r="1.5" fill="#37474F" />
              {/* Body */}
              <path d="M 485 304 C 485 304 505 295 520 310 C 530 320 535 340 525 350 Z" fill="#ECEFF1" />
              {/* Paw on Mia */}
              <ellipse cx="482" cy="308" rx="7" ry="5" fill="#FFFFFF" />
            </g>
          </g>

          {/* Floor */}
          <rect x="0" y="415" width="800" height="35" fill="#D7CCC8" />

          {/* Floating ZZZs */}
          <g opacity="0.8">
            <motion.text x="500" y="220" className="fill-purple-500 font-mono font-bold text-lg"
              animate={{ y: [0, -30], x: [0, 8], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeOut' }}
            >Z</motion.text>
            <motion.text x="515" y="190" className="fill-purple-400 font-mono font-bold text-xl"
              animate={{ y: [0, -35], x: [0, -6], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: 1, ease: 'easeOut' }}
            >z</motion.text>
          </g>
        </svg>
      );

    case 2:
      // Scene 2: Gentle Mom entering room to wake up Mia.
      return (
        <svg id="svg-scene-2" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-amber-50 overflow-hidden">
          <defs>
            <linearGradient id="door-light" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFDE7" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Classroom structure / Window side */}
          <rect x="0" y="0" width="800" height="450" fill="#FFFDE7" />
          <rect x="0" y="400" width="800" height="50" fill="#E0C3FC" opacity="0.4" /> {/* carpet */}

          {/* Gentle Door and Light entering */}
          <path d="M 50 450 L 50 50 L 180 0 L 180 450 Z" fill="#D7CCC8" opacity="0.3" />
          <path d="M 180 0 L 550 450 L 180 450 Z" fill="url(#door-light)" />

          {/* Smiling Mother standing gently */}
          <g id="mother-character" transform="translate(10, 10)">
            {/* Clothes */}
            <path d="M 140 390 C 120 300 110 210 140 170 C 145 160 165 160 170 170 C 200 210 190 300 170 390 Z" fill="#80DEEA" />
            {/* Apron or nice heart pattern */}
            <path d="M 145 220 Q 155 240 165 220" fill="none" stroke="#FFFFFF" strokeWidth="3" />
            <path d="M 155 250 L 155 310" stroke="#FFBCAF" strokeWidth="8" strokeLinecap="round" />
            
            {/* Neck */}
            <rect x="148" y="145" width="14" height="20" fill="#FFD54F" opacity="0.75" />
            
            {/* Head */}
            <circle cx="155" cy="115" r="30" fill="#FFE0B2" />
            
            {/* Hair */}
            <path d="M 122 110 C 120 70 190 70 188 110 C 195 125 190 150 185 155 C 182 145 180 130 180 120 Q 155 105 130 120" fill="#5D4037" />
            <circle cx="180" cy="140" r="10" fill="#5D4037" /> {/* cute bun */}

            {/* Mother's face features */}
            <path d="M 142 115 Q 146 120 150 115" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />{/* Eye */}
            <path d="M 160 115 Q 164 120 168 115" stroke="#3E2723" strokeWidth="2.5" strokeLinecap="round" fill="none" />{/* Eye */}
            <path d="M 150 125 Q 155 135 160 125" stroke="#D84315" strokeWidth="3" strokeLinecap="round" fill="none" />{/* Warm Smile */}

            {/* Little pink cheeks */}
            <circle cx="138" cy="125" r="5" fill="#FF8A80" opacity="0.6" />
            <circle cx="170" cy="125" r="5" fill="#FF8A80" opacity="0.6" />

            {/* Speaking bubble sign */}
            <path d="M 175 70 Q 220 50 240 70 T 175 100" fill="none" />
          </g>

          {/* Waking up Mia on right side */}
          <g transform="translate(180, 50)">
            {/* Bed on right */}
            <rect x="220" y="270" width="350" height="90" rx="15" fill="#A1887F" />
            <rect x="230" y="260" width="330" height="35" rx="10" fill="#B2DFDB" />
            <rect x="230" y="215" width="100" height="50" rx="15" fill="#F8BBD0" />

            {/* Mia waking up slightly */}
            <ellipse cx="320" cy="225" rx="28" ry="26" fill="#FFE0B2" />
            {/* Hair */}
            <path d="M 292 220 Q 320 180 348 220 L 345 250 L 295 250 Z" fill="#212121" />
            {/* Happy half-open eyes */}
            <path d="M 305 225 L 315 225" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
            <path d="M 325 225 L 335 225" stroke="#4E342E" strokeWidth="3" strokeLinecap="round" />
            <path d="M 314 236 Q 320 240 326 236" stroke="#D84315" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="302" cy="232" r="5" fill="#FF8A80" opacity="0.6" />

            {/* Blanket */}
            <path d="M 340 240 C 370 230 450 240 550 250 L 550 310 L 340 310 Z" fill="#80CBC4" />
          </g>

          {/* Friendly sun peeking through right top corner */}
          <g transform="translate(700, -20)">
            <circle cx="50" cy="50" r="50" fill="#FFCA28" opacity="0.4" />
            <circle cx="50" cy="50" r="35" fill="#FF8F00" />
          </g>
        </svg>
      );

    case 3:
      // Scene 3: Mia hiding in blankets.
      return (
        <svg id="svg-scene-3" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-sky-50 overflow-hidden"
          onClick={() => setPeekState(!peekState)}>
          {/* Wall background */}
          <rect width="800" height="450" fill="#FFFDE7" />
          <rect y="380" width="800" height="70" fill="#CFD8DC" /> {/* floor */}

          <text x="30" y="40" className="fill-slate-400 font-sans text-xs select-none">💡 点击画面可以让小米探出头哦！</text>

          {/* Giant Bed taking focus */}
          <g transform="translate(50, 40)">
            <rect x="50" y="240" width="600" height="110" rx="15" fill="#8D6E63" />
            <rect x="65" y="225" width="570" height="40" rx="10" fill="#E0F7FA" />

            {/* Giant soft pillow */}
            <rect x="70" y="160" width="180" height="85" rx="30" fill="#FF8A80" opacity="0.8" />

            {/* Hidden Mia & Peek state logic */}
            <g style={{ transform: peekState ? 'translateY(-25px)' : 'translateY(0px)' }} className="transition-transform duration-500">
              {/* Mia's cute face hiding or peeking */}
              <ellipse cx="200" cy="180" rx="36" ry="34" fill="#FFE0B2" />
              {/* Short haircut */}
              <path d="M 164 175 Q 200 135 236 175 L 230 210 L 170 210 Z" fill="#212121" />
              
              {/* Cheerful giggling eyes */}
              <path d="M 180 180 Q 186 174 192 180" stroke="#4E342E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              <path d="M 210 180 Q 216 174 222 180" stroke="#4E342E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <circle cx="178" cy="190" r="7" fill="#FF8A80" opacity="0.75" />
              <circle cx="222" cy="190" r="7" fill="#FF8A80" opacity="0.75" />
              {/* Giggling mouth */}
              <path d="M 194 196 Q 200 205 206 196" stroke="#D84315" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>

            {/* Blanket pulled up high */}
            <g className="cursor-pointer" onClick={() => handleEntityClick('bed')} {...getHighlightPulse('bed')}>
              {/* Pull-up Blanket shape */}
              <path d="M 65 210 C 130 190 220 140 270 210 C 330 230 540 220 635 230 L 635 295 L 65 295 Z" fill="#4DB6AC" />
              {/* Cute yellow dots on Blanket */}
              <circle cx="120" cy="240" r="6" fill="#FFF176" />
              <circle cx="180" cy="235" r="8" fill="#FFF176" />
              <circle cx="150" cy="270" r="5" fill="#FFF176" />
              <circle cx="230" cy="255" r="7" fill="#FFF176" />
              <circle cx="300" cy="245" r="6" fill="#FFF176" />
              <circle cx="360" cy="265" r="9" fill="#FFF176" />
              <circle cx="420" cy="250" r="5" fill="#FFF176" />
              <circle cx="490" cy="260" r="8" fill="#FFF176" />
            </g>

            {/* Little bunny ears peeking from cover */}
            <g transform="translate(180, 55)" className="cursor-pointer" onClick={() => handleEntityClick('happy')} {...getHighlightPulse('happy')}>
              <ellipse cx="100" cy="90" rx="10" ry="25" fill="#FFFFFF" />
              <ellipse cx="100" cy="90" rx="5" ry="18" fill="#FFCDD2" />
              
              <ellipse cx="125" cy="95" rx="10" ry="24" fill="#FFFFFF" transform="rotate(15, 125, 95)" />
              <ellipse cx="125" cy="95" rx="5" ry="17" fill="#FFCDD2" transform="rotate(15, 125, 95)" />
              {/* Bunny's cute closed eyes */}
              <path d="M 103 125 Q 106 128 109 125" stroke="#78909c" strokeWidth="2" fill="none" />
              <path d="M 115 125 Q 118 128 121 125" stroke="#78909c" strokeWidth="2" fill="none" />
            </g>
          </g>
        </svg>
      );

    case 4:
      // Scene 4: Mia slowly opens her eyes.
      return (
        <svg id="svg-scene-4" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-orange-50 overflow-hidden">
          {/* Super cute child portrait zoom-in */}
          <rect width="800" height="450" fill="#FFF3E0" />

          <g className="cursor-pointer" onClick={() => handleEntityClick('eyes')} {...getHighlightPulse('eyes')}>
            {/* Round face */}
            <circle cx="400" cy="210" r="160" fill="#FFE0B2" />
            
            {/* Short black hair with child bangs */}
            <path d="M 235 180 C 240 70 560 70 565 180 C 580 230 570 320 540 340 L 530 200 L 270 200 L 260 340 Z" fill="#212121" />
            <path d="M 270 180 Q 300 130 330 180" fill="#212121" />
            <path d="M 330 180 Q 360 130 390 180" fill="#212121" />
            <path d="M 390 180 Q 420 130 450 180" fill="#212121" />
            <path d="M 450 180 Q 480 130 510 180" fill="#212121" />
            <path d="M 510 180 Q 540 130 570 180" fill="#212121" />
            
            {/* Blushing pink round cheeks */}
            <ellipse cx="280" cy="250" rx="30" ry="25" fill="#FF8A80" opacity="0.65" />
            <ellipse cx="520" cy="250" rx="30" ry="25" fill="#FF8A80" opacity="0.65" />

            {/* EYELIDS OPEN OR BLINK */}
            {!isBlinking ? (
              <g id="sparkling-eyes">
                {/* Left eye circle */}
                <circle cx="325" cy="210" r="28" fill="#3E2723" />
                <circle cx="316" cy="198" r="9" fill="#FFFFFF" /> {/* Highlighting light */}
                <circle cx="334" cy="218" r="5" fill="#FFFFFF" /> {/* Sparkle */}
                {/* Beautiful girly lashes */}
                <path d="M 295 200 Q 315 190 335 198" stroke="#212121" strokeWidth="4" fill="none" />
                <line x1="298" y1="200" x2="291" y2="191" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
                <line x1="312" y1="193" x2="308" y2="182" stroke="#212121" strokeWidth="3" strokeLinecap="round" />

                {/* Right eye circle */}
                <circle cx="475" cy="210" r="28" fill="#3E2723" />
                <circle cx="466" cy="198" r="9" fill="#FFFFFF" />
                <circle cx="484" cy="218" r="5" fill="#FFFFFF" />
                {/* Girly lashes */}
                <path d="M 465 198 Q 485 190 505 200" stroke="#212121" strokeWidth="4" fill="none" />
                <line x1="502" y1="200" x2="509" y2="191" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
                <line x1="488" y1="193" x2="492" y2="182" stroke="#212121" strokeWidth="3" strokeLinecap="round" />
              </g>
            ) : (
              <g id="blinking-eyes">
                {/* Closed smiley eyelids */}
                <path d="M 295 210 Q 325 225 355 210" stroke="#3E2723" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M 445 210 Q 475 225 505 210" stroke="#3E2723" strokeWidth="6" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Sweet round Nose */}
            <path d="M 395 235 Q 400 240 405 235" stroke="#D84315" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* Bright happy Smile */}
            <path d="M 370 265 Q 400 300 430 265" fill="#D84315" stroke="#B71C1C" strokeWidth="3" />
            <path d="M 382 271 Q 400 286 418 271" fill="#FFCDD2" />
          </g>

          {/* Sweet child collar style */}
          <path d="M 350 370 C 370 410 430 410 450 370" fill="#F06292" />
          <path d="M 300 370 C 340 370 380 430 400 430 C 420 430 460 370 500 370 L 520 450 L 280 450 Z" fill="#E8F5E9" />
          
          {/* Sparkly indicators */}
          <motion.g animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Sparkles className="absolute text-yellow-400 w-12 h-12" style={{ left: '12%', top: '25%' }} />
            <polyline points="100,100 110,120 130,125 115,140 120,160 100,150 80,160 85,140 70,125 90,120" fill="#FFD54F" opacity="0.8" transform="translate(80, 50) scale(0.6)" />
            <polyline points="100,100 110,120 130,125 115,140 120,160 100,150 80,160 85,140 70,125 90,120" fill="#FFD54F" opacity="0.8" transform="translate(620, 80) scale(0.6)" />
          </motion.g>
        </svg>
      );

    case 5:
      // Scene 5: Mia looking out the window, waving to the smiling Sun.
      return (
        <svg id="svg-scene-5" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-sky-200 overflow-hidden">
          {/* Sunny countryside background seen from window */}
          <rect width="800" height="450" fill="#BBDEFB" />
          <path d="M-50 450 Q 200 300 500 450 Z" fill="#A5D6A7" />
          <path d="M350 450 Q 600 280 900 450 Z" fill="#81C784" />

          {/* Waving Sun公公 */}
          <g id="shining-sun" className="cursor-pointer" onClick={() => handleEntityClick('sun')} {...getHighlightPulse('sun')}>
            {/* Rays */}
            <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 25, ease: 'linear' }} style={{ originX: '180px', originY: '130px' }}>
              <path d="M 180 60 L 180 200 M 110 130 L 250 130 M 130 80 L 230 180 M 130 180 L 230 80" stroke="#FF9800" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
            </motion.g>
            <circle cx="180" cy="130" r="50" fill="#FFC107" />
            {/* Face on Sun */}
            <circle cx="165" cy="120" r="5" fill="#3E2723" />
            <circle cx="195" cy="120" r="5" fill="#3E2723" />
            <path d="M 170 140 Q 180 150 190 140" stroke="#E64A19" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="155" cy="132" r="6" fill="#FF5252" opacity="0.7" />
            <circle cx="205" cy="132" r="6" fill="#FF5252" opacity="0.7" />
          </g>

          {/* Bedroom Interior Overlay Frame (Window view) */}
          <path d="M 0 0 L 800 0 L 800 450 L 0 450 Z M 350 380 L 750 380 L 750 70 L 350 70 Z" fill="#FFFBE6" fillRule="evenodd" stroke="#D7CCC8" strokeWidth="10" />

          {/* Golden Curtain decoration hook */}
          <path d="M 330 60 Q 370 120 340 390" fill="none" stroke="#FFF176" strokeWidth="15" opacity="0.85" strokeLinecap="round" />
          <path d="M 770 60 Q 730 120 760 390" fill="none" stroke="#FFF176" strokeWidth="15" opacity="0.85" strokeLinecap="round" />

          {/* Mia sitting in bed near window on the left side, waving */}
          <g transform="translate(-20, 60)">
            {/* Head and Hair */}
            <circle cx="200" cy="160" r="45" fill="#FFE0B2" />
            {/* Hair bangs */}
            <path d="M 152 165 C 150 90 248 90 246 165 C 255 180 250 215 244 220 C 242 210 240 195 240 185 Q 200 170 160 185 C 160 195 158 210 156 220" fill="#212121" />
            {/* Eye looking at window */}
            <circle cx="222" cy="155" r="5" fill="#3E2723" />
            <path d="M 226 142 Q 232 145 238 142" stroke="#212121" strokeWidth="2.5" fill="none" />
            <path d="M 218 172 Q 225 178 232 172" stroke="#D84315" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="215" cy="162" r="7" fill="#FF8A80" opacity="0.6" />

            {/* Pajamas Body */}
            <path d="M 160 250 L 240 250 L 255 350 L 145 350 Z" fill="#FFF9C4" />
            <path d="M 190 250 L 190 350" stroke="#FFF59D" strokeWidth="4" />

            {/* Waving Hand (animated) */}
            <motion.g id="waving-hand" className="cursor-pointer" onClick={() => handleEntityClick('hands')} {...getHighlightPulse('hands')}
              animate={isWaving ? { rotate: [0, -15, 10, -15, 10, 0] } : {}}
              style={{ originX: '240px', originY: '240px' }}
            >
              {/* Sleeve */}
              <path d="M 235 245 Q 260 215 280 200" stroke="#FFEB3B" strokeWidth="18" strokeLinecap="round" fill="none" />
              {/* Child hand palm */}
              <circle cx="290" cy="190" r="14" fill="#FFE0B2" />
              {/* Fingers */}
              <circle cx="282" cy="174" r="4.5" fill="#FFE0B2" />
              <circle cx="292" cy="172" r="4.5" fill="#FFE0B2" />
              <circle cx="301" cy="177" r="4.5" fill="#FFE0B2" />
              <ellipse cx="304" cy="190" rx="4.5" ry="5.5" fill="#FFE0B2" />
            </motion.g>

            {/* Cozy quilt rolled over her lap */}
            <path d="M 100 320 C 130 310 250 315 320 320 L 320 370 L 100 370 Z" fill="#80CBC4" opacity="0.9" />
          </g>

          {/* Floating cute bird chirping melody */}
          <path d="M 370 120 Q 380 110 390 120 L 390 130" stroke="#5C6BC0" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 400 135 Q 410 125 420 135 L 420 145" stroke="#5C6BC0" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 6:
      // Scene 6: "Show me your hands". Mia holds up her two cute little hands.
      return (
        <svg id="svg-scene-6" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-pink-50 overflow-hidden">
          {/* Soft loving pinkish room background */}
          <rect width="800" height="450" fill="#FCE4EC" />
          <line x1="0" y1="390" x2="800" y2="390" stroke="#E1BEE7" strokeWidth="8" />

          {/* Loving parent hand gesture bottom corner */}
          <path d="M 0 450 Q 80 430 110 395 C 130 365 140 330 115 290" fill="none" stroke="#FFE0B2" strokeWidth="24" strokeLinecap="round" />
          <path d="M 10 450 Q 110 400 135 345" fill="none" stroke="#E1BEE7" strokeWidth="10" />

          {/* Mia centering holding up two big cute cartoon hands */}
          <g transform="translate(140, 10)">
            {/* Cozy Bed and Pillow behind */}
            <rect x="50" y="270" width="450" height="120" rx="20" fill="#A1887F" opacity="0.7" />
            <rect x="30" y="230" width="140" height="60" rx="15" fill="#F48FB1" opacity="0.8" />

            {/* Round face */}
            <circle cx="260" cy="180" r="55" fill="#FFE0B2" />
            {/* Cute black hair bangs */}
            <path d="M 200 185 C 195 90 325 90 320 185 C 330 200 328 230 320 235 C 318 220 315 210 315 200 Q 260 180 205 200" fill="#212121" />
            <circle cx="210" cy="190" r="10" fill="#FF8A80" opacity="0.6" />
            <circle cx="310" cy="190" r="10" fill="#FF8A80" opacity="0.6" />
            {/* Open sparkling child eyes */}
            <circle cx="235" cy="180" r="7" fill="#3E2723" />
            <circle cx="232" cy="177" r="2.5" fill="#FFFFFF" />
            <circle cx="285" cy="180" r="7" fill="#3E2723" />
            <circle cx="282" cy="177" r="2.5" fill="#FFFFFF" />
            <path d="M 252 205 Q 260 216 268 205" fill="#FF3D00" stroke="#D84315" strokeWidth="2.5" />

            {/* Pajama body */}
            <path d="M 210 260 L 310 260 L 330 380 L 190 380 Z" fill="#E8F5E9" />
            {/* Little clover pattern */}
            <circle cx="245" cy="300" r="4" fill="#C8E6C9" />
            <circle cx="253" cy="296" r="4" fill="#C8E6C9" />
            <circle cx="253" cy="304" r="4" fill="#C8E6C9" />
            <circle cx="275" cy="320" r="4" fill="#C8E6C9" />
            <circle cx="283" cy="316" r="4" fill="#C8E6C9" />
            <circle cx="283" cy="324" r="4" fill="#C8E6C9" />

            {/* TWO HEART WARM PALMS EXTENDED FORWARD (Glow target) */}
            <g id="hands-interaction" className="cursor-pointer" onClick={() => handleEntityClick('hands')} {...getHighlightPulse('hands')}>
              {/* LEFT cute fat hand */}
              <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
                <path d="M 215 260 L 155 220" stroke="#A1887F" strokeWidth="18" strokeLinecap="round" />
                <circle cx="145" cy="205" r="25" fill="#FFE0B2" />
                {/* 5 cute little fingers */}
                <circle cx="145" cy="173" r="6" fill="#FFE0B2" /> {/* Middle */}
                <circle cx="132" cy="177" r="6" fill="#FFE0B2" /> {/* Pointer */}
                <circle cx="123" cy="190" r="6" fill="#FFE0B2" /> {/* Thumb */}
                <circle cx="158" cy="180" r="6" fill="#FFE0B2" /> {/* Ring */}
                <circle cx="168" cy="195" r="5.5" fill="#FFE0B2" /> {/* Pinky */}
                <circle cx="145" cy="205" r="16" fill="#FFCDD2" opacity="0.6" /> {/* soft pink palm pad */}
              </motion.g>

              {/* RIGHT cute fat hand */}
              <motion.g animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: 'easeInOut' }}>
                <path d="M 305 260 L 365 220" stroke="#A1887F" strokeWidth="18" strokeLinecap="round" />
                <circle cx="375" cy="205" r="25" fill="#FFE0B2" />
                {/* 5 cute little fingers */}
                <circle cx="375" cy="173" r="6" fill="#FFE0B2" /> {/* Middle */}
                <circle cx="362" cy="180" r="6" fill="#FFE0B2" /> {/* Ring */}
                <circle cx="352" cy="195" r="5.5" fill="#FFE0B2" /> {/* Pinky */}
                <circle cx="388" cy="177" r="6" fill="#FFE0B2" /> {/* Pointer */}
                <circle cx="397" cy="190" r="6" fill="#FFE0B2" /> {/* Thumb */}
                <circle cx="375" cy="205" r="16" fill="#FFCDD2" opacity="0.6" />
              </motion.g>
            </g>
          </g>

          {/* Floating red hearts / butterflies of happiness */}
          <path d="M 120 120 Q 130 100 140 120 Q 150 100 160 120 L 140 145 Z" fill="#FF8A80" opacity="0.85" transform="translate(450, 40) scale(0.6)" />
          <path d="M 120 120 Q 130 100 140 120 Q 150 100 160 120 L 140 145 Z" fill="#FFCA28" opacity="0.85" transform="translate(120, 100) scale(0.5)" />
        </svg>
      );

    case 7:
      // Scene 7: Mia woke up energetic! Raising hands saying "I am awake!"
      return (
        <svg id="svg-scene-7" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-emerald-50 overflow-hidden">
          {/* Sunny Room Energetic morning theme */}
          <rect width="800" height="450" fill="#E8F5E9" />
          <line x1="0" y1="400" x2="800" y2="400" stroke="#C8E6C9" strokeWidth="10" />

          {/* Big smiling Sun peeking outside window in center-left */}
          <rect x="70" y="50" width="180" height="150" rx="10" fill="#E1F5FE" stroke="#B0BEC5" strokeWidth="5" />
          <circle cx="160" cy="120" r="30" fill="#FFB300" />
          
          {/* Mia sitting up big and excited */}
          <g id="awake-mia-group" className="cursor-pointer" onClick={() => handleEntityClick('awake')} {...getHighlightPulse('awake')}>
            <g transform="translate(300, 30)">
              {/* Bed base */}
              <rect x="-100" y="290" width="400" height="85" rx="15" fill="#8D6E63" />
              <rect x="-90" y="275" width="380" height="20" rx="5" fill="#ECEFF1" />

              {/* Head */}
              <circle cx="100" cy="130" r="48" fill="#FFE0B2" />
              {/* Cute black hair bouncing */}
              <path d="M 45 130 C 40 45 155 45 150 130 T 130 170 Q 100 150 70 170 C 65 160 60 150 50 140" fill="#212121" />
              
              {/* Wide energetic closed eyes (happy smiley arc) */}
              <path d="M 68 128 Q 78 135 88 128" stroke="#3E2723" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 112 128 Q 122 135 132 128" stroke="#3E2723" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <circle cx="58" cy="138" r="9" fill="#FF8A80" opacity="0.65" />
              <circle cx="140" cy="138" r="9" fill="#FF8A80" opacity="0.65" />

              {/* Wide open laughing mouth */}
              <path d="M 85 150 Q 100 175 115 150 Z" fill="#B71C1C" />
              <circle cx="100" cy="143" r="3" fill="#FFE0B2" />

              {/* Pajamas Body */}
              <path d="M 60 210 L 140 210 L 160 300 L 40 300 Z" fill="#E0F2F1" />
              <circle cx="100" cy="240" r="4" fill="#80CBC4" />
              <circle cx="100" cy="265" r="4" fill="#80CBC4" />

              {/* Arms pointing raised high straight to the sky! ("I am awake!") */}
              <g id="raised-arms">
                {/* Left hand sleeve & arm */}
                <path d="M 70 210 L 25 140" stroke="#B2DFDB" strokeWidth="16" strokeLinecap="round" />
                <circle cx="20" cy="135" r="12" fill="#FFE0B2" />
                
                {/* Right hand sleeve & arm */}
                <path d="M 130 210 L 175 140" stroke="#B2DFDB" strokeWidth="16" strokeLinecap="round" />
                <circle cx="180" cy="135" r="12" fill="#FFE0B2" />
              </g>

              {/* Bunny toy resting on bed happily */}
              <g transform="translate(170, 220)">
                <ellipse cx="15" cy="15" rx="6" ry="12" fill="#ECEFF1" />
                <circle cx="20" cy="30" r="12" fill="#FFFFFF" />
                <circle cx="16" cy="27" r="1.5" fill="#3E2723" />
                <circle cx="24" cy="27" r="1.5" fill="#3E2723" />
                <path d="M 17 34 Q 20 37 23 34" stroke="#FF8A80" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>

              {/* Soft bed sheet lines */}
              <path d="M-90 285 Q 10 290 110 285 T 280 285" stroke="#B2EBF2" strokeWidth="3" fill="none" opacity="0.4" />
            </g>
          </g>

          {/* Action indicator lines representing yelling / energy */}
          <g stroke="#FFD54F" strokeWidth="4" strokeLinecap="round" opacity="0.8">
            <line x1="280" y1="130" x2="250" y2="120" />
            <line x1="270" y1="160" x2="240" y2="175" />
            <line x1="520" y1="130" x2="550" y2="120" />
            <line x1="510" y1="160" x2="540" y2="175" />
          </g>
        </svg>
      );

    case 8:
    default:
      // Scene 8: Mia hugging bunny tightly smiling, saying "I am happy!"
      return (
        <svg id="svg-scene-8" viewBox="0 0 800 450" className="w-full h-full rounded-2xl shadow-inner bg-yellow-50 overflow-hidden">
          {/* Cozy gold bedroom light */}
          <rect width="800" height="450" fill="#FFFDE7" />
          {/* Warm background circles representing cozy sparkles */}
          <circle cx="400" cy="220" r="280" fill="#FFF9C4" opacity="0.4" />
          <circle cx="400" cy="220" r="200" fill="#FFF59D" opacity="0.2" />

          {/* Golden Stars floating for success/happy aura */}
          <g fill="#FFA000">
            <motion.path d="M 230 100 L 235 110 L 245 111 L 237 118 L 240 128 L 230 122 L 220 128 L 223 118 L 215 111 L 225 110 Z" 
              animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
            <motion.path d="M 570 120 L 575 130 L 585 131 L 577 138 L 580 148 L 570 142 L 560 148 L 563 138 L 555 131 L 565 130 Z" 
              animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0.5 }} />
          </g>

          {/* Warm Mia hugged profile */}
          <g id="happy-hug-group" className="cursor-pointer" onClick={() => handleEntityClick('happy')} {...getHighlightPulse('happy')}>
            <g transform="translate(240, 40)">
              {/* Cozy background bedroom elements */}
              <path d="M-80 340 L 400 340" stroke="#F0F4C3" strokeWidth="12" />

              {/* Mia's cuddled head */}
              <circle cx="160" cy="140" r="55" fill="#FFE0B2" />
              {/* Fluffy cute short haircut */}
              <path d="M 94 140 C 90 40 230 40 226 140 C 235 155 230 185 224 190 Q 160 160 96 190 C 95 180 94 165 94 150" fill="#212121" />
              
              {/* Content, deeply happy closed eyes (arcs pointing down) */}
              <path d="M 120 140 Q 130 148 140 140" stroke="#3E2723" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 175 140 Q 185 148 195 140" stroke="#3E2723" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              {/* Super lovely flush cheeks */}
              <circle cx="112" cy="155" r="12" fill="#FF8A80" opacity="0.8" />
              <circle cx="202" cy="155" r="12" fill="#FF8A80" opacity="0.8" />
              {/* Cutest happy smiley heart-mouth */}
              <path d="M 148 165 Q 160 180 172 165 Z" fill="#D84315" />

              {/* Yellow Cozy pajamas with pink hearts */}
              <path d="M 100 220 L 220 220 L 245 330 L 75 330 Z" fill="#FFF9C4" />
              <path d="M 135 250 Q 140 240 145 250 T 155 250 L 145 265 Z" fill="#FF8A80" />
              <path d="M 175 280 Q 180 270 185 280 T 195 280 L 185 295 Z" fill="#FF8A80" />

              {/* TIGHT HUG ARMS around the white bunny */}
              <g id="bunny-hugged">
                {/* Fluffy white bunny standing in front of her chest */}
                <ellipse cx="145" cy="205" rx="12" ry="32" fill="#FFFFFF" transform="rotate(-15, 145, 205)" /> {/* Left ear */}
                <ellipse cx="145" cy="205" rx="6" ry="24" fill="#FFCDD2" transform="rotate(-15, 145, 205)" />
                
                <ellipse cx="170" cy="210" rx="12" ry="32" fill="#FFFFFF" transform="rotate(15, 170, 210)" /> {/* Right ear */}
                <ellipse cx="170" cy="210" rx="6" ry="24" fill="#FFCDD2" transform="rotate(15, 170, 210)" />

                {/* Bunny head */}
                <circle cx="158" cy="245" r="24" fill="#FFFFFF" />
                <circle cx="163" cy="250" r="5" fill="#FF8A80" opacity="0.6" />
                {/* Closed content bunny eyes */}
                <path d="M 148 243 Q 152 246 156 243" stroke="#78909C" strokeWidth="2.5" fill="none" />
                <path d="M 162 243 Q 166 246 170 243" stroke="#78909C" strokeWidth="2.5" fill="none" />
                <ellipse cx="158" cy="251" rx="2" ry="3" fill="#FF8A80" /> {/* sweet heart nose */}

                {/* Bunny fluffy cozy round body */}
                <circle cx="160" cy="290" r="32" fill="#ECEFF1" />
                <circle cx="160" cy="290" r="12" fill="#FFFFFF" /> {/* Bunny tummy pad */}

                {/* Mia's chubby hands wrapping around holding the bunny */}
                <path d="M 98 230 Q 120 250 140 280" stroke="#FFE0B2" strokeWidth="18" strokeLinecap="round" fill="none" />
                <path d="M 222 230 Q 200 250 180 280" stroke="#FFE0B2" strokeWidth="18" strokeLinecap="round" fill="none" />
              </g>

            </g>
          </g>

          {/* Sweet quote cloud or notes of music */}
          <path d="M 150 200 Q 140 180 160 170 T 180 190" stroke="#CFD8DC" strokeWidth="3" fill="none" />
        </svg>
      );
  }
}
