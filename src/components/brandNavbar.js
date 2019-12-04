import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../img/hk01branding3.png'
import styled from 'styled-components'
// style the projectTitle
const ProjectTitle = styled.div`
    margin-left: 0.5em;
    display: inline-block;
    vertical-align:top;
    font-size: 1.5rem;
    line-height: 37px;
`;

function Brand(){
    return(
<div>
  <Navbar>
    <Navbar.Brand href="#home">
      <img
        alt="香港01"
        src={logo}
        height="37"
        className="d-inline-block align-top"
      />
    <ProjectTitle>選民人口統計一覽</ProjectTitle>
    </Navbar.Brand>
  </Navbar>  
  </div>      
    );
}

export default Brand;