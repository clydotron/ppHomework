import React, {useState, useEffect, Fragment, useLayoutEffect} from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import './RoadmapContainer.css'
import WorkArea from './WorkArea/WorkArea'
import ToolArea from './ToolArea/ToolArea'
import Onboarding from './Onboarding/Onboarding'
import onboardingContent from './Onboarding/onboarding-content'
import DropHereTarget from './Onboarding/DropHereTarget'
import API from './../API/API'

//
// Onboarding state machine:
// when the app starts and has loaded data, check to see if 
//  1. onboarding has already been shown
//  2. if not, are there any lanes?
// if not, show the

// onboarding states:
// active: on/off
// status: firstLane, firsTask, moreTasks

const RoadmapContainer = (props) => {

  const [tools,setTools] = useState([])
  const [hasData,setHasData] = useState(false)
  const [roadmap,setRoadmap] = useState({})
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingData, setOnboardingData] = useState({})
  const [showDropHere,setShowDropHere] = useState(false)
  const [onboardingState,setOnboardingState] = useState("showAddLane")
  const [laneRowLookup,setLaneRowLookup] = useState({})

  //4 dates: ShowAddLane, ShowAddTask, ShowAddSecondTask, complete.
  // >>> make persistent
  // >>> make lane counter persistent (so i always get increasing lanes)

  // data structures:
  // do we want to have a roadmap object that contains everything, or lanes and ordereds lanes?
  // pros-cons: having a simple list (only lane ids) for the ordered is simple and easy to manipulate 
  // (dont have to worry about deep copies)
  useEffect(() => {

    setTools([{id:"add_lane", title:"Add Lane", type:"lane"},{id:"add_task", title:"Add Task", type:"task"}])

    updateRoadmap()
  },[])

  useLayoutEffect(() => {

    // check to see if the roadmap has been loaded yet
    if (typeof roadmap.lanes === 'undefined') {
      //console.log("no roadmap lane data yet")
      return
    }

    if (!hasData) {
      return
    }

    // BDG - 
    const numLanes = Object.keys(roadmap.lanes).length
    //console.log("ULE - numLanes: ",Object.keys(roadmap.lanes).length)

    if (numLanes === 0 && onboardingState === "showAddLane") {
      //if first time, show onboarding
      if (!showOnboarding) {
        setTimeout(() => { 
          showOnboardingDialog(onboardingContent.addLane)
          setOnboardingState("showAddTask")
        },1000)
      }
      console.log("show onboarding:")
    }
    if (numLanes === 1 && onboardingState === "showAddTask") {
      console.log("Show AddTask");
      showOnboardingDialog(onboardingContent.addTask)
      //setOnboardingState("showAddSecondTask")
    }

  },[roadmap,hasData,onboardingState])

  const showOnboardingDialog = (content) => {
    setOnboardingData(content)
    setShowOnboarding(true)
  }

  // ----------------------------------------------------------------------------------------------
  const createNewLane = () => {
    const laneId = roadmap.nextLaneId
    roadmap.nextLaneId += 1

    // move this into its own DB entry (style?)
    const laneColors =[ "#00d084","#0693e3","purple","tomato"]

    const newLane = {
      title: `lane ${laneId}`,
      color: laneColors[laneId % laneColors.length],
      collapsed: false,
      rows: []
    }  

    //add the placeholder row?
    console.log("new lane:",newLane)
    return newLane
  }

  // ----------------------------------------------------------------------------------------------
  const createNewTask = () => {
    const taskId = roadmap.nextTaskId
    roadmap.nextTaskId += 1

    const taskColors =[ "green","#059933","#00cc88","#00ff88"]

    const newTask = {
      title: `task ${taskId}`,
      color: taskColors[taskId % taskColors.length],
      id: `task-${taskId}`
    }
    return newTask
  }

  // ----------------------------------------------------------------------------------------------
  const updateRoadmap = async () => {

    try {
      const resp = await API.get(`roadmap/${props.roadmap_id}`) //use the roadmap id
      const newRoadmap = resp.data
 
      let rowCounter = 0
      let taskCounter = 0;

      const laneLookup = {}

      // replace with for loop
      newRoadmap.lanes.forEach((lane,laneIndex) => {   
        lane.id = laneIndex
   
        // filter out all rows with zero tasks
        lane.rows = lane.rows.filter(row => row.tasks.length > 0)

        // assign each row a unique id and add it to the lane lookup table
        lane.rows.forEach(row => {
          row.id = `row-${rowCounter}`
          rowCounter++
       
          // assign each task a unqiue id
          row.tasks.forEach(task => {
            task.id = `task-${taskCounter}`
            taskCounter++
          })
        })

        // there needs to be at least 1 empty row per lane...
        lane.rows.push({
          id: `row-${rowCounter}`,
          tasks: []
        })
        rowCounter++

        lane.rows.forEach(row => {
          laneLookup[row.id] = laneIndex
        })
      })

      //console.log("updateRoadmap: ",newRoadmap)
      //console.log("laneLookup: ",laneLookup)

      setLaneRowLookup(laneLookup)
      setRoadmap(newRoadmap);
      setHasData(true)
      return
    }
    catch(err) {
      console.log(err)
    }
  }

  // ----------------------------------------------------------------------------------------------
  const updatePersistentStorage = (updatedRoadmap,reload) => {

    //console.log("updatePersistentStorage:",updatedRoadmap)

    API.patch(`roadmap/${updatedRoadmap.id}`,JSON.stringify(updatedRoadmap))
    .then(_resp => {
      //console.log(`updatePersistentStorage: success`) 
      if(reload) {
        updateRoadmap()
      }
      else {
        setRoadmap(updatedRoadmap) //@todo find better way to force update (or not)
      }
      // or just reload - probably better to force a reload and correct everything
    })
    .catch(resp => { console.log("updatePersistentStorage: error >>",resp) })
  }

  // ----------------------------------------------------------------------------------------------
 
  // use the drag start callback to determine if we need to show the drop here target
  // (shown if there are zero lanes, and the onboarding state is 'add_lane')
  const onDragStart = (result) => {
    //console.log("Dragging: ",result)

    const {source} = result;
    
    // if the user is dragging a new lane, show the "drop here"
    if ( source.droppableId === 'tool-area-lane') {
      setShowDropHere(true)
    }
  }

  // ----------------------------------------------------------------------------------------------
 
  const onDragEnd = (result) => {
    //console.log(result)
    setShowDropHere(false)

    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'task') {
    
      // make a copy of the existing roadmap:
      // if something goes awry with this, we want the original to be prestine
      // there is a better way to do this.
      const newRoadmap = {
        ...roadmap
      }

      //const dstLaneId = laneRowLookup[destination.droppableId]
      const dstLane = newRoadmap.lanes[laneRowLookup[destination.droppableId]]
      if (dstLane === undefined) {
        console.log("### Error ### failed to find lane for row: ",destination.droppableId)
        return
      }
      const dstRow = dstLane.rows.find(row => row.id === destination.droppableId)
      if(dstRow === undefined) {
        //error message
        return
      }

      // check if new task: 
      if( source.droppableId === 'tool-area-task') { 

        dstRow.tasks.splice(destination.index, 0, createNewTask())
        newRoadmap.nextTaskId = roadmap.nextTaskId

        updatePersistentStorage(newRoadmap,true)
        return
      } 

      // the user dragged an existing task:
      // check to see if this is within the same row
      if (destination.droppableId === source.droppableId) {

        var newTasks = Array.from(dstRow.tasks);
        newTasks.splice(destination.index, 0, newTasks.splice(source.index,1)[0]);
        dstRow.tasks = newTasks

      } else {

        //make a copy of the current roadmap,
        // if anything goes wrong, we want the original to be prestine

        // if not in the same row, remove the task from the source row
        const srcLane = roadmap.lanes[laneRowLookup[source.droppableId]]
        if (srcLane === undefined) {
          //error
          return
        }

        const srcRow = srcLane.rows.find(row => row.id === source.droppableId)
        if(srcRow === undefined) {
          //error
          return
        }

        const ttask = srcRow.tasks.splice(source.index,1)[0]

        // and add it to the destination
        dstRow.tasks.splice(destination.index,0, ttask)
        //updatePersistentStorage(newRoadmap,false)
      }

      updatePersistentStorage(newRoadmap,true)
      return
    } 
 

    // >>> create new lane <<<
    // User dropped a new lane onto the work area:
    //  create a new lane item, 
    //  add it to the list of lanes at the correct index
    //  cycle thru the list of lanes, update the indexes so they match

    if (type === 'lane') {
    
      var newLanes = Array.from(roadmap.lanes);

      if(source.droppableId === 'tool-area-lane') {
        // new lane
        newLanes.splice(destination.index, 0, createNewLane());  
      }
      else {
        // reorder existing lane
        newLanes.splice(destination.index, 0, newLanes.splice(source.index,1)[0]);
      }

      // update the ids (am i still using this?)
      newLanes.forEach((lane, index) => {
        lane.id = index 
      })

      const newRoadmap = {
        ...roadmap,
        lanes: newLanes
      }
      
      updatePersistentStorage(newRoadmap,true)
      return;
    }
  }

// ----------------------------------------------------------------------------------------------
 
  const handleUpdateLane = (data) => {
    //console.log(">> update << ",data) 
    //@todo make sure the lane actually exists?

    roadmap.lanes[data.id] = data;

    const newRoadmap = {
      ...roadmap
    }
    updatePersistentStorage(newRoadmap,false)
  }

// ----------------------------------------------------------------------------------------------
 
  const handleDeleteLane = (laneId) => {
    console.log(`delete lane: ${laneId}`)
 
    // @todo confirm the delete:

    var newLanes = Array.from(roadmap.lanes);
    newLanes.splice(laneId, 1)

    const newRoadmap = {
      ...roadmap,
      lanes: newLanes
    }
    updatePersistentStorage(newRoadmap,true)
  }

// ----------------------------------------------------------------------------------------------
 
  const renderOnboarding = () => {
  
    if (!showOnboarding) {
      return null
    }
    // get the position of the target element:
    const pos = {x: 1200, y: 200 }

    // make this conditional...
    var container = document.getElementById("tools_lane")
    if ( container) {
      //console.log(container.getBoundingClientRect())
      pos.y = container.getBoundingClientRect().top
    }

    return (
      <Onboarding
        show={showOnboarding}
        onClose={() => {setShowOnboarding(false)}}
        content={onboardingData}
        position={pos}
      />    
    )
  }

  // const renderDropHereTarget = () => {
  //   if(!showDropHere) {
  //     return null;
  //   }

  //   return (
  //     <div className="drop-here-target">
  //       <h3>Drop Here</h3>
  //     </div>
  //   )
  // }

  const orderedLanes = () => {
    if (hasData) {
      //console.log("WTF ",roadmap)
      return roadmap.lanes
    }
    return []
  }

  //todo: DropHereTarget should probably be rendered as the placeholder for dnd?
  // should only be visible when the something is being dragged over,
  // 
  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className="roadmap-container">
          <div className="work-area">
            <DropHereTarget active={showDropHere} />
            <WorkArea 
              lanes={orderedLanes()} 
              onUpdateLane={handleUpdateLane}
              onDeleteLane={handleDeleteLane}
           
              />
          </div>
          <div className="tool-area">
            <ToolArea tools={tools}/>
          </div>
        </div>
      </DragDropContext>
      {renderOnboarding()}            
    </Fragment>
  )
}

export default RoadmapContainer