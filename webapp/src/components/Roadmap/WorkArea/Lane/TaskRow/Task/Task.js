import React, { Component } from 'react'
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
display: inline-block;
  border: 1px solid lightgrey;
  border-radius: 3px;
  padding: 8px;
  margin: 4px;
  width: 250px;
  height: 24px;
  background-color: ${props => props.isDragging ? 'lightgreen' : props.bkColor};
  text-align: left;
`;

export default class Task extends Component {

  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index} type="task">
        {(provided,snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            bkColor={this.props.task.color}
          >
            {this.props.task.title}
          </Container>
        )}
      </Draggable>
    )
  }
}
