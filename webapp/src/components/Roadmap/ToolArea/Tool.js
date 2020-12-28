import React, {useEffect} from 'react'
import styled from 'styled-components'
import { Droppable, Draggable } from 'react-beautiful-dnd'

import './Tool.css'

const Container = styled.div` 
  border: 1px solid lightgrey;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  height: 36px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Helvetica;
  font-size: 16px;
  background-color: white;
`;
//background-color: ${props => props.isDragging ? 'lightblue' : '#E4E6E8'};

const ImageBox = styled.div` 
  width: 12px;
  height: 14px;
  margin-right: 8px;
`
const ToolIcon = styled.div`
  width: 100%;
  background-image: url("../../../../assets//images/tool_4.svg");
  background-size: cover;
  height: 0;
  padding: 0;
  padding-bottom: 115%;
`
// .image_box {
//   width: 12px;
//   height: 14px;
//   margin-right: 8px;
// }
//needs droppy

// draggables must be inside a droppable... why dont we make the tool container the undrop-on-able container?
// by doing this, we can control the 'type' 

const Tool = (props) => {
  useEffect(() => {
    //console.log(props.tool)
  },[])

  const dropId = `tool-area-${props.tool.type}`;
  const toolId = `tools_${props.tool.type}`
  return (
    <Droppable droppableId={dropId} type={props.tool.type} >
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Draggable draggableId={props.tool.id} index={props.index} type={props.tool.type}>
            {(provided) => (  
              <Container
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                ref={provided.innerRef}
                id={toolId}
              >
                <ImageBox>
                  <div className="bg_svg">
                  </div>
                </ImageBox>  
                {props.tool.title}
              </Container>
            )}
          </Draggable>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default Tool