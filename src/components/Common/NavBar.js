import React from "react";
import styled from "styled-components";

const MainContainer = styled.div`
  width: 100%;
  height: 60px;
  background: black;
  -webkit-app-region: drag;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 100000;
  & > * {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background 0.1s ease-in-out;
  }
`;

export default function NavBar() {
  return <MainContainer></MainContainer>;
}
