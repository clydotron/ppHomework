import React, {useEffect,useState,Fragment} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import {SketchPicker} from 'react-color'

const Button = styled.button`
  background-color: ${props => props.bkcolor}
`
const Roadmap = (props) => {

  const [lanes,setLanes] = useState([])
  const [hasData,setHasData] = useState(false)
  const [title,setTitle] = useState("undefined")
  const [showColorPicker,setShowColorPicker] = useState(false)

  useEffect(() => {
    updateRoadmap()
  },[])

  const updateRoadmap = () => {

    axios.get("/api/v1/roadmaps/1") //use the roadmap id
    .then( resp => { 
      const payload = resp.data.data  
      setTitle(payload.attributes.title)
    
      const lanes = []
      resp.data.included.map( lane => {   
        if( lane.type === "lane" ) {
          const data = lane.attributes
          data.id = lane.id
          lanes.push(data)
        }
      })

      setLanes(lanes)
      setHasData(true)
    })
    .catch( resp => { console.log(resp)})
  }


  const handleAddLane = async (e) => {
    let res = await axios.post("/api/v1/lanes", {title:"newLaneX", color:"blue", roadmap_id:1 })
    .then(resp => { 
      console.log("added new lane: newLaneX")
      updateRoadmap() })
    .catch(resp => console.log(resp))
  }

  const handleDeleteLane = (lane_id) => {
    // @todo add confirm dialog

    //showModal - 
    axios.delete(`/api/v1/lanes/${lane_id}`)
    .then( resp => { 
        updateRoadmap();
    })
    .catch( resp => { console.log(resp) })
  }

  const handleUpdateColor = (lane_id) => {
    console.log("update color")
    //show modal color selector
    setShowColorPicker(true)
  }

  const laneList = lanes.map( lane => {
    return <div key={lane.id}>lane:{lane.id} title:{lane.title}
    <button onClick={() => handleDeleteLane(lane.id)}>X</button>
    <Button onClick={() => handleUpdateColor(lane.id)} bkcolor={lane.color}>C</Button>
    </div>
  })
  /*
  { this.state.displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ this.handleClose }/>

  <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
  </div> : null }
*/
  const handleColorClose = () => {
    setShowColorPicker(false)
  }

  const handleColorChange = (color) => {
    console.log(color)

  }
  return (
    <Fragment>
      {
        hasData &&
        <div>
          <div>{title}</div>
        
          <div>
            <button className="addLane" onClick={handleAddLane}>AddLane</button>
          </div>
          <div>
            {laneList}
          </div>
        </div>
      }
        { showColorPicker ?  
          <div className="popover">
            <div className="cover" onClick={ handleColorClose }/>
            <SketchPicker  onChange={ handleColorChange } />
          </div> : null 
        }
      
    </Fragment>
  )
}
export default Roadmap