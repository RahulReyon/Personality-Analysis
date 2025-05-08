import React from 'react'

const ResultCard = ({ title, description, Strength,strength , Weakness ,weakness,Imporvement, imporvement,}) => {
  return (
      <div className={`bg-white p-6 rounded-xl shadow-md mb-4`}>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-700">{description}</p>
        <h3 className="text-xl font-bold">{Strength}</h3>
        <p className="mt-2 text-gray-700">{strength}</p>
        <h3 className="text-xl font-bold">{Weakness}</h3>
        <p className="mt-2 text-gray-700">{weakness}</p>
        <h3 className="text-xl font-bold">{Imporvement}</h3>
        <p className="mt-2 text-gray-700">{imporvement}</p>
       
      
        
      </div>
  );
}

export default ResultCard
