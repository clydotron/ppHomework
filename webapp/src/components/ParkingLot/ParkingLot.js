import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
height: 500px;
overflow: hidden;
`
const WorkArea = styled.div`
  background: #e8f6fe;
  width: auto;
  height: 100%;
  overflow: hidden;
  margin-right: 186px;
  overflow-x: scroll;
  white-space: nowrap;
`
const ToolArea = styled.div`
    width: 180px;
    float: right;
    background: #aafed6;  
    height: 100%;
`

const TopBar = styled.div`
 width: auto;
 height: 50px;
 background: orange;

`

//overflow-x: scroll;
//white-space: nowrap;

// display: flex;
// flex-direction: row;
// flex-wrap: nowrap;
const Card = styled.div`
height: 50px;
width:200px;
margin-left: 5px;
background: gray;
display: inline-block;

`
//overflow: hidden

const ParkingLot = (props) => {

  return (
    <Container>ParkingLot
      <ToolArea>
        tools
      </ToolArea>
      <WorkArea>
        <TopBar>
          <Card>Card 1</Card>
          <Card>Card 2</Card>
          <Card>Card 3</Card>
          <Card>Card 4</Card>
          <Card>Card 5</Card>
          <Card>Card 6</Card>
          <Card>Card 7</Card>
        </TopBar>
        words
      </WorkArea>

    </Container>
  )
}
export default ParkingLot