import React from 'react'
import styled from 'styled-components';

const Header = () => {
  return (
    <div>
      <Heading>To Do List</Heading>
    </div>
  )
}

export default Header

const Heading = styled.h1`
    margin-left: 60px;
`;