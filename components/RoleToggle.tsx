import React from 'react';
import { JobRole } from '../types';
import { Briefcase, PenTool, Code } from 'lucide-react';

interface RoleToggleProps {
  selectedRole: JobRole;
  onChange: (role: JobRole) => void;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({ selectedRole, onChange }) => {
  const getTranslateClass = () => {
    switch (selectedRole) {
      case JobRole.MARKET_RESEARCH:
        return 'translate-x-0';
      case JobRole.UI_UX:
        return 'translate-x-[100%]';
      case JobRole.FRONTEND:
        return 'translate-x-[200%]';
      default:
        return 'translate-x-0';
    }
  };

  return (
    <div className="flex justify-center mb-8 w-full px-2 sm:px-0">
      <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex relative w-full max-w-[550px]">
        {/* Sliding Background */}
        <div
          className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/3)] bg-indigo-600 rounded-lg transition-transform duration-300 ease-in-out ${getTranslateClass()}`}
        />
        
        {/* Market Research Button */}
        <button
          onClick={() => onChange(JobRole.MARKET_RESEARCH)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 rounded-lg text-[11px] sm:text-sm font-medium transition-colors duration-200 ${
            selectedRole === JobRole.MARKET_RESEARCH ? 'text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
          type="button"
        >
          <Briefcase size={16} className="hidden sm:block" />
          <span className="whitespace-nowrap">Market Research</span>
        </button>

        {/* UI/UX Button */}
        <button
          onClick={() => onChange(JobRole.UI_UX)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 rounded-lg text-[11px] sm:text-sm font-medium transition-colors duration-200 ${
            selectedRole === JobRole.UI_UX ? 'text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
          type="button"
        >
          <PenTool size={16} className="hidden sm:block" />
          <span className="whitespace-nowrap">UI/UX Design</span>
        </button>

        {/* Frontend Button */}
        <button
          onClick={() => onChange(JobRole.FRONTEND)}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 rounded-lg text-[11px] sm:text-sm font-medium transition-colors duration-200 ${
            selectedRole === JobRole.FRONTEND ? 'text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
          type="button"
        >
          <Code size={16} className="hidden sm:block" />
          <span className="whitespace-nowrap">Frontend Developer</span>
        </button>
      </div>
    </div>
  );
};