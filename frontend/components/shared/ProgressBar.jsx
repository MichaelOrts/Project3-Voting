import React from 'react';
import PropTypes from 'prop-types';

const steps = [
  { name: 'Registering Voters', status: 0 },
  { name: 'Proposals Registration Started', status: 1 },
  { name: 'Proposals Registration Ended', status: 2 },
  { name: 'Voting Session Started', status: 3 },
  { name: 'Voting Session Ended', status: 4 },
  { name: 'Votes Tallied', status: 5 },
];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="flex items-center w-full max-w-6xl mx-auto">
      {steps.map((step, index) => (
        <div key={step.name} className="flex-1 flex flex-col items-center mx-2">
          <div className="relative mb-2 flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep >= step.status ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-300 text-gray-600 border-gray-300'}`}>
              {step.status + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-grow h-1 ml-2 ${currentStep > step.status ? 'bg-blue-500' : 'bg-gray-300'}`} />
            )}
          </div>
           <div className="text-sm whitespace-nowrap">{step.name}</div>
        </div>
      ))}
    </div>
  );
};

ProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default ProgressBar;
