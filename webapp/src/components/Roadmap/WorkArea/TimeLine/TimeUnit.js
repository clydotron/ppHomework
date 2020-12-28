import React from 'react'
import styled from 'styled-components'
//import './TimeUnit.css'
  
const Container = styled.div`
    width: 300px;
    height: 100%;
    background: lightgray;
    display:inline-block;
`
const Label = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    width: 150px;
    height: 30px;
`
//font color?

const Marker = styled.div`
    width: 100px;
    height: 30px;
    display:inline-block;
`

const TimeUnit = (props) => {
    return (
        <Container> 
            <Label>{props.label}</Label>
            <div>
                <Marker>.</Marker>
                <Marker>.</Marker>
                <Marker>.</Marker>
            </div>
        </Container>
    )
  }
  
  export default TimeUnit