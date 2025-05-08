import React from 'react'
const PersonalityType = ({ type }) => {
  return (
    <div className="bg-indigo-100 p-4 rounded-xl mb-4">
      <h4 className="text-lg font-semibold text-indigo-800">Your  Personality Type: {type}</h4>
    </div>
  )
}

export default PersonalityType
