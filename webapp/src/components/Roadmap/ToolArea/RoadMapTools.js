import React from 'react';
import './RoadMapTool.css'
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
//border: 1px solid lightgrey;

const Container = styled.div` 
  box-sizing: border-box;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
  height: 36px;
  background-color: ${props => props.isDragging ? 'lightblue' : '#E4E6E8'};
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Helvetica;
  font-size: 16px;
`;

const ToolIcon = styled.div`
  display: block;
  width: 26px;
  height: 26px;
  background: url("../../tools_icon.svg");
  background-size: 26px 26px;

`;


class RoadMapTool extends React.Component {

render() {  
  const dropId = `tool-area-${this.props.tool.type}`;

  return(
    <Droppable droppableId={dropId} type={this.props.tool.type} >
      {(provided) => (
        <div 
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Draggable draggableId={this.props.tool.id} index={this.props.index} type={this.props.type}>
              {(provided,snapshot) => (
                <Container
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  isDragging={snapshot.isDragging}
                >
                  <div className="image_box">
                    <div className="bg_svg" />
                  </div>
                
                  {this.props.tool.name}

                </Container>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
      )}
    </Droppable>
  );
}
}
export default RoadMapTool;
