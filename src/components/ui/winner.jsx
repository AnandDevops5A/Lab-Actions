'use client'
import React from 'react';
import { Trophy, Star, CheckCircle } from 'lucide-react'; 

const WinnerSection = () => {
  // Array of achievements to map over
  const achievements = [
    {
      icon: Trophy,
      stat: '50+',
      title: 'Industry Awards',
      description: 'Recognized globally for innovation and execution across multiple sectors.',
      color: 'text-yellow-400',
    },
    {
      icon: Star,
      stat: '99.9%',
      title: 'Success Rate',
      description: 'Our proprietary methodology guarantees results and client satisfaction.',
      color: 'text-red-500',
    },
    {
      icon: CheckCircle,
      stat: '$1B+',
      title: 'Value Generated',
      description: 'Direct impact on client revenue and market capitalization documented.',
      color: 'text-green-400',
    },
  ];

  return (
    <section className="bg-gray-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Aggressive and Modern Headline */}
        <div className="text-center mb-12 sm:mb-20  fadeup">
          <p className="text-sm font-extrabold  tracking-widest text-red-500">
            MENS💪 means BEAST😈
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
              className="fadeup bg-gray-900 border border-gray-800 p-8 rounded-xl shadow-2xl transition duration-300 transform hover:scale-[1.02] hover:shadow-red-900/50 relative overflow-hidden"
            >
              {/* Vibrant Corner Accent */}
              <span className={`absolute top-0 right-0 h-1/2 w-1/2 rounded-bl-full opacity-10 ${achievement.color.replace('text', 'bg')}`}></span>
              
                <achievement.icon className={`autorotate w-12 h-12 mb-4 ${achievement.color}`} />
              
              <p className="text-5xl font-extrabold text-slate-100 mb-2">
                {achievement.stat}
              </p>
              
              <h3 className="text-xl font-bold uppercase tracking-wider text-gray-200 mb-3">
                {achievement.title}
              </h3>
              
              <p className="text-gray-400 text-base">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Call to Action (Aggressive) */}
        <div className="fadeup mt-16 sm:mt-24 text-center">
          <a
            href="#contact"
            className=" inline-block px-12 py-4 text-lg font-extrabold uppercase tracking-wider text-slate-100 bg-red-600 rounded-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:-translate-y-1 ring-4 ring-red-600 ring-offset-4 ring-offset-gray-950"
          >
            Claim Your Victory
          </a>
        </div>
        
      </div>
    </section>
  );
};

export default WinnerSection;



