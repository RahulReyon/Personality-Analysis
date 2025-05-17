import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from 'recharts';
import PageAnimationWrapper from '../components/PageAnimationWrapper';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon
} from 'react-share';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CF0'];

const traitEmojis = {
  Openness: '🧠',
  Conscientiousness: '✅',
  Extraversion: '🎉',
  Agreeableness: '❤️',
  Neuroticism: '😬'
};

const traitInfo = {
  Openness: 'Creative and open to new experiences.',
  Conscientiousness: 'Organized and dependable.',
  Extraversion: 'Outgoing and energetic.',
  Agreeableness: 'Compassionate and cooperative.',
  Neuroticism: 'Prone to emotional instability.'
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const { name, score, value } = payload[0].payload;
  const label = name || payload[0].name;
  const cleanName = label.replace(/[^A-Za-z]/g, '');
  const info = traitInfo[cleanName] || 'Trait information unavailable.';
  return (
    <div className="bg-white p-3 border rounded shadow">
      <p className="font-bold">{label}</p>
      <p>{score ? `Score: ${score}` : `Value: ${value}`}</p>
      <p className="text-sm text-gray-600">{info}</p>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [mbtiData, setMbtiData] = useState([]);
  const [bigfiveData, setBigfiveData] = useState([]);
  const [bigfivePieData, setBigfivePieData] = useState([]);
  const [quizType, setQuizType] = useState(null);
  const [summary, setSummary] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const chartRef = useRef();

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save('personality-results.pdf');
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in to view your dashboard');
        return;
      }

      const userId = session.user.id;
      const { data, error } = await supabase
        .from('userinfo')
        .select('mbti_responses, bigfive_responses')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
        return;
      }

      if (data.mbti_responses && data.mbti_responses.length > 0) {
        setQuizType('mbti');
        const counts = {};
        data.mbti_responses.forEach(item => {
          item.selectedOptions.forEach(option => {
            counts[option] = (counts[option] || 0) + 1;
          });
        });
        const chartData = Object.keys(counts).map(key => ({
          name: key,
          value: counts[key]
        }));
        setMbtiData(chartData);
        const topType = chartData.reduce((max, curr) => curr.value > max.value ? curr : max, chartData[0]);
        setSummary(`You exhibit strong tendencies toward the ${topType.name} personality type.`);
      } else if (data.bigfive_responses && data.bigfive_responses.length > 0) {
        setQuizType('bigfive');
        const scores = {};
        data.bigfive_responses.forEach(item => {
          const dimension = item.questionText.split(':')[0];
          const score = parseInt(item.selectedOptions[0], 10) || 0;
          scores[dimension] = (scores[dimension] || 0) + score;
        });
        const total = Object.values(scores).reduce((acc, val) => acc + val, 0);
        const chartData = Object.keys(scores).map(key => ({
          name: `${key} ${traitEmojis[key] || ''}`,
          score: scores[key]
        }));
        const pieData = Object.keys(scores).map((key, index) => ({
          name: key,
          value: ((scores[key] / total) * 100).toFixed(1),
          fill: COLORS[index % COLORS.length]
        }));
        setBigfiveData(chartData);
        setBigfivePieData(pieData);
        const topTrait = chartData.reduce((max, curr) => curr.score > max.score ? curr : max, chartData[0]);
        setSummary(`Your most prominent trait is ${topTrait.name}.`);
      }

      if (!localStorage.getItem('seenDashboardConfetti')) {
        setShowConfetti(true);
        localStorage.setItem('seenDashboardConfetti', 'true');
        setTimeout(() => setShowConfetti(false), 4000);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10">Loading dashboard...</div>;
  if (!quizType) return <div className="text-center p-10">No quiz data found. Take a quiz to see your results!</div>;

  const shareUrl = window.location.href;

  return (
    <PageAnimationWrapper>
      {showConfetti && <Confetti width={width} height={height} />}

      <motion.div
        className="max-w-5xl mx-auto p-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="absolute top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
        >
          Toggle Theme
        </button>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold">Your {quizType === 'mbti' ? 'MBTI' : 'Big Five'} Results</h2>
          <p className="mt-4 text-lg text-gray-600">{summary}</p>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={handleDownloadPDF}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download as PDF
          </button>
        </div>

        <div className="flex justify-center mb-6 gap-4">
          <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round /></FacebookShareButton>
          <TwitterShareButton url={shareUrl}><TwitterIcon size={32} round /></TwitterShareButton>
          <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round /></WhatsappShareButton>
        </div>

        <div ref={chartRef}>
          {quizType === 'mbti' && (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={mbtiData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {quizType === 'bigfive' && (
            <>
              <div className="mb-10">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={bigfiveData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="score" fill="#4c51bf">
                      <LabelList dataKey="score" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bigfivePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {bigfivePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </PageAnimationWrapper>
  );
};

export default Dashboard;
