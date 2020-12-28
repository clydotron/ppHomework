import React, {useState, useEffect, useRef, Fragment} from 'react'
import axios from 'axios'
import './PlanningBoard.css'


//sorted list of tasks: can create, update (name, color, ?), sort, delete
const PlanningBoard = (props) => {

  const [hasData,setHasData] = useState(false)
  const [newTaskMode, setNewTaskMode] = useState(false)
  const [tasks,setTasks] = useState([])
  const [dragging,setDragging] = useState(false)
  const dragItem = useRef()
  const dragNode = useRef()

  useEffect(() => {

    // get the tasks from the database (but these arent just any tasks)

    const seedTasks = [
      {id: 1001, title: "task1", color: "orange"},
      {id: 1002, title: "task2", color: "purple"},
      {id: 1003, title: "task3", color: "green"},
      {id: 1004, title: "task4", color: "#blue"}
    ]

    setTasks(seedTasks)
  },[tasks.length])

  const createNewTask = () => {
    console.log("newTask")

    const newTask = {
      title:"task X", 
      description:"",
      color:"orange"
    } 
    axios.post("/api/v1/tasks", newTask)
    .then(resp => { 
      console.log("success") 
      setTasks( {...tasks,newTask})
    })
    .catch(resp => console.log(resp))

  }

  const renderDefaultView = () => {
    return <div>default</div>
  }

  const renderNewTaskView = () =>{
    return <div>
      new!
    </div>
  }

  const handleDragStart = (e,params) => {
    //console.log(params)
    dragItem.current = params
    dragNode.current = e.target
    dragNode.current.addEventListener('dragend',handleDragEnd)
    setTimeout(()=> {
      setDragging(true)
    })
 
  }

  const handleDragEnter = (e,params) => {
   
    if (e.target !== dragNode.current) {
      //console.log("drag enter: >>>",params)
      //console.log("Old:", dragItem.current.index," new ", params.index)
      // we need to remove ou
      const dragged = dragItem.current.index;

      setTasks( oldTasks => {
        const sorted = Array.from(oldTasks)
        sorted.splice(params.index, 0, sorted.splice(dragged,1)[0])
        return sorted
      })

      dragItem.current = params
    }
  }

  const handleDragEnd= (e) => {
    //console.log("end")
    dragNode.current.removeEventListener('dragend',handleDragEnd)
    dragItem.current = null
    dragNode.current = null
    setDragging(false)
  }

  const getItemStyle = (params) => {
    if (dragging) {
      const currentItem = dragItem.current
      if (currentItem.index === params.index) {
        return "current dnd-item"
      }
    }
    return "dnd-item"
  }

  const taskList = tasks.map((task,index) => {
    return <div 
              draggable
              onDragStart={(e) => {handleDragStart( e, {index})}}
              onDragEnter={dragging?(e) => handleDragEnter(e,{index}):null}
              className={getItemStyle({index})}
              key={task.id} 
              background-color={task.color}
            >{task.title}</div>
  })
  
  // add new task mode (at some point)
  return (
    <div className="container">PlanningBoard
      
      <div className = "dnd-grid">
        <div className="dnd-group">
          {taskList}
        </div>
      </div>

      <button onClick={createNewTask}>Create new task</button>
      <div>
    
      </div>

    </div>
  )
}
export default PlanningBoard