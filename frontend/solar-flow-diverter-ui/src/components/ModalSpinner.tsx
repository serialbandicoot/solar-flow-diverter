import React from 'react';

interface ModalSpinnerProps {
  loading: boolean;
}

const ModalSpinner: React.FC<ModalSpinnerProps> = ({ loading }) => {
  
  return (
    <div>
      {loading && (
        <div className="modal">
          <div className="modal-content">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ModalSpinner;
