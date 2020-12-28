import React, { useState, useEffect } from 'react';
import RoadmapContainer from './../Roadmap/RoadmapContainer'
import PlanningBoard from './../PlanningBoard/PlanningBoard'
import ParkingLot from './../ParkingLot/ParkingLot'
import API from './../API/API'
import ViewSelector from '../ViewSelector/ViewSelector.js'

const Workspace = (props) => {

  const allViews = {
    'roadmap' : 'Roadmap',
    'planning_board' : 'Planning board',
    'parking_lot' : 'Parking lot'
};

  // import the different views
  const [view,setView] = useState('roadmap');
  const [hasData,setHasData] = useState(false)

  useEffect(() => {
    const roadmap_id = props.workspace.roadmap

    API.get(`roadmap/${roadmap_id}`)
    .then( resp => { setHasData(true) })
    .catch( resp => { console.log(resp)})
    },[])

  function renderCurrentView() {

    //console.log(view)
    
    switch(view) {
      case 'roadmap':
        return <RoadmapContainer roadmap_id={props.workspace.roadmap} />; //add the roadmap id

      case 'planning_board':
        return <PlanningBoard />;
      
      case 'parking_lot':
        return <ParkingLot />;
    }
    return null
  }

  return (
    <div className="Workspace">
    {
      hasData &&
      <div>
        <div className="Workspace-viewSelector">
          <ViewSelector view={view} allViews={allViews} onViewSelected={view => setView(view)}/>
        </div>
        <div className="Workspace-view">
          {renderCurrentView()}
        </div>  
      </div>
    }
    </div>
  )
}

export default Workspace;