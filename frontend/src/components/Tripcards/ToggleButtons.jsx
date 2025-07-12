import React from 'react';

const ToggleButtons = ({ activeSection, setActiveSection }) => {
  const sections = [
    { key: 'places_visited', label: 'Places Visited' },
    { key: 'activities', label: 'Activities' },
    { key: 'hotels', label: 'Hotels' },
    { key: 'restaurants', label: 'Restaurants' }
  ];

  return (
    <div className="toggle-buttons">
      {sections.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setActiveSection(key)}
          className={activeSection === key ? 'active' : ''}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButtons;