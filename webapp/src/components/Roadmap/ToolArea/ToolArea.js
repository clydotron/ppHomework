import React from 'react';
import { Droppable } from 'react-beautiful-dnd'
import Tool from './Tool';
import styled from 'styled-components'

const Container = styled.div`
  padding: 16px;
`

const ToolArea = (props) => {

  const tools = props.tools.map((tool,index) => {
    return <div key={index}><Tool tool={tool} index={index} /></div>
  })

  // make this a non-op droppable
  return (
    <Droppable droppableId={"tool-area"} type="tools" >
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Container>
            {tools}
          </Container>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default ToolArea;
