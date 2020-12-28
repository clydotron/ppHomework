import React, { useState, useEffect } from 'react';
import styled from 'styled-components'

const DropHereFrame = styled.div`
  width: 100%;
  box-sizing: border-box;
  border: 1px dashed gray;
  height: 160px;
  margin: 8px;
  margin-right: 16px;
  border-radius: 8px;
  padding-right: 16px;
  transition: visible 0.2s ease;
  background-color: ${props => (props.active ? 'skyblue' : 'green' )};
  visible: ${props => (props.active ? 'true' : 'false' )};
`

const DropHereText = styled.h3`
  margin: auto;
`

const DropHereTarget = (props) => {

  const [isActive, setIsActive] = useState(props.active)

  useEffect(() => {
    setIsActive(props.active)
  },[props])

  const renderDropHereTarget = () => {
    if(!isActive) {
      return null
    }
    //do i need to use 
    return (
      <DropHereFrame active={props.active}>
      <DropHereText>
        Drop Here!
      </DropHereText>  
    </DropHereFrame>
    )
  }

  return (
    <div>
      {renderDropHereTarget()}
    </div>
  ) 

}

export default DropHereTarget