import React from 'react'
import styled from 'styled-components'
import './TimeLine.css'
import './TimeUnit'
import TimeUnit from './TimeUnit'

// const Container = styled.div`
//   background: #e8f6fe;
//   width: auto;
//   height: 100%;
//   overflow: hidden;
//   margin-right: 186px;
//   overflow-x: scroll;
//   white-space: nowrap;
  
// `
// const TimeUnit = styled.div`
//     width: 300px;
//     height: 100%;
//     background: gray;
//     display: inline-block;
// `

// background: repeating-linear-gradient(
//     to right,
//     #ffffff,
//     #ffffff 99px,
//     #d8d8d8 99px,
//     #d8d8d8 100px
//   );

//
//
const TimeLine = (props) => {
    return (
        <div className="time-line-container">
            <TimeUnit label="Q1"></TimeUnit>
            <TimeUnit label="Q2"></TimeUnit>
            <TimeUnit label="Q3"></TimeUnit>
            <TimeUnit label="Q4"></TimeUnit>
            <TimeUnit label="Q1"></TimeUnit>
            <TimeUnit label="Q2"></TimeUnit>
        </div>
    )
  }
  
  export default TimeLine