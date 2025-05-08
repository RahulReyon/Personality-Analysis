// src/components/charts/BigFiveChart.jsx
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { usePersonality } from '../../context/PersonalityContext';

const BigFiveChart = () => {
  const { bigFiveResult } = usePersonality();

  if (!bigFiveResult) return null;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <h2 className="text-xl font-semibold mb-2">Big Five Personality Traits</h2>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={bigFiveResult}>
          <PolarGrid />
          <PolarAngleAxis dataKey="trait" />
          <PolarRadiusAxis angle={30} domain={[0,80]} />
          <Tooltip />
          <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BigFiveChart;