'use client'
import React, { useContext } from 'react';
import { Trophy, Star, CheckCircle } from 'lucide-react'; 
import GamingBackground from './gaming-background';
import { ThemeContext } from '@/lib/contexts/theme-context';

const WinnerSection = () => {
  // Array of achievements to map over
  const { isDarkMode } = useContext(ThemeContext);

  const achievements = [
    {
      icon: Trophy,
      stat: 'Future Goals',
      title: 'Community-Driven Tournaments',
      description: 'Our goal is to build the best tournament platform with you. Your participation and feedback shape our future.',
      color: 'text-yellow-400',
    },
    {
      icon: Star,
      stat: 'Fair Play',
      title: 'Commitment to Integrity',
      description: 'We are dedicated to ensuring a fair and competitive environment for all players. Together, we build trust.',
      color: 'text-red-500',
    },
    {
      icon: CheckCircle,
      stat: 'Growing Rewards',
      title: 'Bigger Prize Pools',
      description: 'As our community grows, so will the rewards. We are committed to offering exciting and valuable prizes.',
      color: 'text-green-400',
    },
  ];

  return (
    <section className="relative bg-gray-950 py-16 sm:py-24 overflow-hidden">
      <GamingBackground isDarkMode={isDarkMode} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aggressive and Modern Headline */}
        <div className="text-center mb-12 sm:mb-20  fadeup">
          <p className="text-sm font-extrabold  tracking-widest text-yellow-600">
            WE Will RISE ✨ TOGETHER 
          </p>
          <h2 className="mt-2 text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-100 leading-tight autoblur">
            We Don&apos;t Just Compete. <p className="text-red-500">We Conquer.</p>
          </h2>
        </div>

        {/* Achievement Grid */}
        <div className=" grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-12">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="fadeup bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.02] hover:shadow-red-900/50 relative overflow-hidden flex flex-col h-full"
            >
              {/* Vibrant Corner Accent */}
              <span className={`absolute top-0 right-0 h-1/2 w-1/2 rounded-bl-full opacity-10 ${achievement.color.replace('text', 'bg')}`}></span>
              
                <achievement.icon className={`autorotate w-12 h-12 mb-4 ${achievement.color}`} />
              
              <p className={`text-[2rem] font-extrabold mb-2 min-h-20 ${achievement.color} drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
                {achievement.stat}
              </p>
              
              <h3 className="text-lg font-bold uppercase tracking-wider text-slate-100 mb-3 min-h-14 drop-shadow-md">
                {achievement.title}
              </h3>
              
              <p className="text-slate-300 text-base grow drop-shadow-sm">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Call to Action (Aggressive) */}
        {/* <div className="fadeup mt-16 sm:mt-24 text-center">
          <a
            href="#contact"
            className=" inline-block px-12 py-4 text-lg font-extrabold uppercase tracking-wider text-slate-100 bg-red-600 rounded-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:-translate-y-1 ring-4 ring-red-600 ring-offset-4 ring-offset-gray-950"
          >
            Join the Ranks
          </a>
        </div> */}
        
      </div>
    </section>
  );
};

export default WinnerSection;
