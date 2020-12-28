import React from 'react';
import './Onboarding.css';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const Container = styled.div`
position: absolute;
display: inline-block;
top: 100px;
right: 200px;
box-shadow: 3px 3px 5px 3px rgba(0, 0, 0, 0.4);
`
//;
class Onboarding extends React.Component {


  renderDetails() {

    return (
      <div className="contentArea">

        <div className="topzone" >
          <div className="x_button">
        <FontAwesomeIcon icon={faTimes} color="#5E6266" onClick={this.props.onClose} />  
        </div>
        
        </div>
        <div className="drop_target">
          <div className="dropped_item">
            <div className="di_icon_box">
                    <div className="di_icon_svg" />
                  </div>
            <div className="dropped_item_text">
              {this.props.content.caption}
            </div>
          </div>
        </div>

        <h3>{this.props.content.title}</h3>
        <p>
          {this.props.content.body}
        </p>
        <h5>
          {this.props.content.callToAction}
        </h5>
        <div className="buttonZone">  
          <button className="okButton" onClick={this.props.onClose}>
            {this.props.content.buttonText}
          </button>
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="backdrop">
        <Container position={this.props.position}>
          <div id="onboarding" className="on left" >
            <div className="onboarding-arrow"/>
            <div className="onboarding-inner">
              {this.renderDetails()}
            </div>
          </div>
        </Container>
      </div>
    )
  }
}

Onboarding.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
}
export default Onboarding;
