import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import TaskRow from './TaskRow/TaskRow';
import EditableText from './../../../EditableText/EditableText'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { TwitterPicker} from 'react-color'
import './Lane.css';

const LaneContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
`

const Container = styled.div`
  
  padding: 0px;
  border: 1px solid lightgrey;
  background-color: white;
  border-radius: 2 px;
  
  display: flex;
  flex-direction: column;
  min-height: 80px;

  background: repeating-linear-gradient(
    to right,
    #ffffff,
    #ffffff 124px,
    #d8d8d8 124px,
    #d8d8d8 125px
  );
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${props => props.bkcolor}
`;

// align-items: center;
const OpenCloseWidget = styled.div`
  padding-left: 8px;
  padding-top: 8px;
  cursor: pointer;
`
//padding: 8px 6px 0px 0px;

// used for the setting (color-picker) and delete icons
const LaneWidgetRight = styled.div`
  float:right;
  width:20px;
  padding-top: 8px;
  padding-right: 6px;
  cursor: pointer; 
`

const Title = styled.h3`
  padding-top: 8px;
  padding-left: 8px;
  border: 0px;
  margin: 0px 0px 2px 0px;
  text-align: left;
  flex-grow:1;
`;

//background-color: ${props => props.bkcolor}

const Settings = styled.div`
  background-color:  blue;
  width: 24px;
  height: 24px;
`
const SettingsCover = styled.div`
  position: absolute;
  zIndex: 2;
`

const SettingsPopover = styled.div`
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
`

const Lane = (props) => {
  
  const [mouseOver,setMouseOver] = useState(false)
  const [collapsed,setCollapsed] = useState(false)
  const [showSettings,setShowSettings] = useState(false)
 
  useEffect(() => {
    updateLaneData();
  },[props])

  const updateLaneData = () => {
    setCollapsed(props.data.collapsed)
  }

  const handleTextUpdate  = (newText) => {
    const data = {
      ...props.data,
      title: newText
    }
    props.onUpdate(data)
  }

  const settingsClicked = () => {
    setShowSettings(true)
  }

  const deleteClicked = () => {
    props.onDelete(props.data.id)
  }

  const handleNewColor = (color) => {
    const data = {
      ...props.data,
      color: color
    }
    props.onUpdate(data)
  }

  const getActionIcon = () => {
    return collapsed ? faCaretUp : faCaretDown
  }

  const toggleCollapased = () => {
    const newValue = !collapsed
    setCollapsed(newValue)
 
    const data = {
      ...props.data,
      collapsed: newValue
    }
    props.onUpdate(data)
  }

  // @todo make the icon color configurable (via props?)
  return(
    <Draggable 
      draggableId={`lane-${props.data.id}`}
      index={props.index} 
      key={props.data.id}
      type="lane"
      >
      {(provided,snapshot) => (
       <LaneContainer
       {...provided.draggableProps}
            ref={provided.innerRef}
       >
          <TopBar 
            {...provided.dragHandleProps} 
            
            onMouseEnter={() => setMouseOver(true)}
            onMouseLeave={() => setMouseOver(false)}
            bkcolor={props.data.color}>
            <OpenCloseWidget>
              <FontAwesomeIcon icon={getActionIcon()} onClick={() => {toggleCollapased()}}/>  
            </OpenCloseWidget>
            <EditableText class_name={"lane-title"} text={props.data.title} handleTextUpdate={handleTextUpdate}/>

            {
              mouseOver &&
              <div>
                <LaneWidgetRight> 
                  <FontAwesomeIcon icon={faWindowClose} color="black" onClick={() => {deleteClicked()}}/> 
                </LaneWidgetRight> 
                <LaneWidgetRight>
                  <FontAwesomeIcon icon={faCog} color="black" onClick={() => {settingsClicked()}}/>  
                </LaneWidgetRight>
              </div>
            }
          </TopBar>
          
          {
          showSettings &&
          <SettingsPopover>
            <SettingsCover onClick={() => setShowSettings(false)}>
              <TwitterPicker color={props.data.color} onChange={(color) => handleNewColor(color.hex) }/>
            </SettingsCover>
          </SettingsPopover>
        }
        {
          !collapsed &&
          <Container>
            {props.data.rows.map((row, index) => {
              return <TaskRow key={row.id} id={row.id} tasks={row.tasks} index={index} />
            })}
          </Container>
        }
        </LaneContainer>
      )}
    </Draggable>
  )
};

export default Lane;
{/* <div>
{
  mouseOver &&
  <Settings onMouseDown={settingsClicked}/>
}
</div> */}
//{props.rows.map((row, index) => {
 // return <TaskRow key={row.id} id={row.id} tasks={row.tasks} index={index} />
//})}



// return (
//   <div>
//     <button onClick={ this.handleClick }>Pick Color</button>
//     { this.state.displayColorPicker ? <div style={ popover }>
//       <div style={ cover } onClick={ this.handleClose }/>
//       <ChromePicker />
//     </div> : null }
//   </div>
// )
// }