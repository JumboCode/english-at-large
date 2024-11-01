// import React, { useState } from 'react';

interface FilterPopupProps {
  isOpen: boolean
  toggle: () => void
}

const FilterPopup = (props: FilterPopupProps) => {
  const {
    isOpen,
    toggle
  } = props;

  return (
    <div className="App">
      {/* <button onClick={toggle} className="bg-blue-500 text-white px-4 py-2 rounded">
        Open Popup
      </button> */}

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4">Popup Title</h2>
            <p className="mb-4">This is a simple popup content area.</p>
            <button onClick={toggle} className="bg-red-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterPopup;