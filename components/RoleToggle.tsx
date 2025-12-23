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
    <div className="flex justify-center mb-6 sm:mb-8 w-full">
      <div className="bg-slate-100 p-1.5 rounded-xl border border-slate-200/50 shadow-inner flex relative w-full sm:max-w-[550px]">
        {/* Sliding Background */}
        <div
          className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/3)] bg-white border border-slate-200 shadow-sm rounded-lg transition-transform duration-300 ease-in-out ${getTranslateClass()}`}
        />
        
        {/* Market Research Button */}
        <button
          onClick={() => onChange(JobRole.MARKET_RESEARCH)}
          className={`relative z-10 flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-colors duration-200 leading-tight ${
            selectedRole === JobRole.MARKET_RESEARCH ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
          type="button"
        >
          <Briefcase className={`w-4 h-4 sm:w-4 sm:h-4 ${selectedRole === JobRole.MARKET_RESEARCH ? 'text-indigo-500' : 'text-slate-400'}`} />
          <span className="text-center">Market Research</span>
        </button>

        {/* UI/UX Button */}
        <button
          onClick={() => onChange(JobRole.UI_UX)}
          className={`relative z-10 flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-colors duration-200 leading-tight ${
            selectedRole === JobRole.UI_UX ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
          type="button"
        >
          <PenTool className={`w-4 h-4 sm:w-4 sm:h-4 ${selectedRole === JobRole.UI_UX ? 'text-indigo-500' : 'text-slate-400'}`} />
          <span className="text-center">UI/UX Design</span>
        </button>

        {/* Frontend Button */}
        <button
          onClick={() => onChange(JobRole.FRONTEND)}
          className={`relative z-10 flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-2.5 rounded-lg text-[10px] sm:text-sm font-medium transition-colors duration-200 leading-tight ${
            selectedRole === JobRole.FRONTEND ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
          }`}
          type="button"
        >
          <Code className={`w-4 h-4 sm:w-4 sm:h-4 ${selectedRole === JobRole.FRONTEND ? 'text-indigo-500' : 'text-slate-400'}`} />
          <span className="text-center">Frontend Dev</span>
        </button>
      </div>
    </div>
  );
};