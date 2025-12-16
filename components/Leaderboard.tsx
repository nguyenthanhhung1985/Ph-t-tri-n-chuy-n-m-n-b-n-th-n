import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white opacity-20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-2 -ml-2 w-12 h-12 bg-black opacity-10 rounded-full blur-xl"></div>
        <h2 className="text-xl font-bold text-white flex items-center relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Bảng Xếp Hạng
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hạng</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Học sinh</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Điểm</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry, index) => {
              const isTop3 = index < 3;
              let rankIcon = null;
              if (index === 0) rankIcon = "🥇";
              else if (index === 1) rankIcon = "🥈";
              else if (index === 2) rankIcon = "🥉";

              const isCurrentUser = entry.isCurrentUser;

              return (
                <tr 
                    key={index} 
                    className={`transition-colors duration-200 ease-in-out ${
                      isCurrentUser 
                        ? "bg-blue-50 ring-2 ring-inset ring-blue-300 z-10" 
                        : "hover:bg-gray-50"
                    }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8">
                      <span className={`text-lg font-bold ${isTop3 ? "scale-110 drop-shadow-sm" : "text-gray-500 text-sm"}`}>
                        {rankIcon || `#${index + 1}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 shadow-sm transition-transform duration-300 ${isCurrentUser ? 'bg-blue-600 scale-110' : 'bg-gray-400'}`}>
                            {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-medium ${isCurrentUser ? "text-blue-800" : "text-gray-900"}`}>
                                {entry.name}
                            </span>
                            {isCurrentUser && <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Bạn</span>}
                        </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                      isCurrentUser ? "bg-blue-200 text-blue-900 shadow-sm" : "bg-green-100 text-green-800"
                    }`}>
                      {entry.score}/10
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-500 font-mono">
                    {Math.floor(entry.timeSeconds / 60)}m {String(entry.timeSeconds % 60).padStart(2, '0')}s
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
