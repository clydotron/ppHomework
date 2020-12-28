import React from 'react';
import './ViewSelector.css'

function ViewSelector({view,allViews,onViewSelected}) {

  const getViewClass = (viewOption) => {
    return (view === viewOption) ? 'active' : '';
  }

  const renderViewOptions = () => {
    return Object.keys(allViews).map(view => {
      const value = allViews[view];
      return <li className={getViewClass(view)}
              key={value}
              onClick={() => onViewSelected(view)}>{value}</li>;
    });
  }

  return (
    <div className="ViewSelector">
      <div className="ViewSelector-view-title">
        <h1 data-testid="title">{allViews[view]}</h1>
      </div>
      <div className="ViewSelector-view-options">
        <ul data-testid="view-options">
          {renderViewOptions()}
        </ul>
      </div>
    </div>
  )
}

export default ViewSelector;