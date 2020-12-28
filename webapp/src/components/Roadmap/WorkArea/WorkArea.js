import React from 'react'
import styled from 'styled-components'
import Lane from './Lane/Lane'
import TimeLine from './TimeLine/TimeLine'
import { Droppable } from 'react-beautiful-dnd'

const ContainerX = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${props => (props.isDraggingOver ? 'bisque' : 'white' )};
  flex-grow: 1;
  min-height: 500px;
`;
//
const WorkArea = (props) => {

  const lanes = props.lanes.map((lane,index) => {
    //console.log(">>> index: ",index, "lane: ",lane)
    return ( 
            <div key={index}>
              <Lane 
                data={lane} 
                index={index} 
                onUpdate={props.onUpdateLane}
                onDelete={props.onDeleteLane} 
                />
            </div>
          )
  })
  
  return (
    <div>
      <TimeLine>

      </TimeLine>
   
    <Droppable droppableId="roadmap-lanes" type="lane">
    {(provided,snapshot) => (
      <ContainerX
        ref={provided.innerRef}
        {...provided.droppableProps}
        isDraggingOver={snapshot.isDraggingOver}
        >
        {lanes}
        {provided.placeholder}
      </ContainerX>
    )}
  </Droppable>
  </div>
  )
}

export default WorkArea