import React from 'react'

const ProgressBar = ({ current, total }) => {
  const width = (current / total) * 100
  return (
    <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
      <div
        className="bg-indigo-600 h-4 rounded-full transition-all"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  )
}

export default ProgressBar
