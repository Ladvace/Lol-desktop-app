import React from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

export default function Home() {
  const dispatch = useDispatch();
  return (
    <Container onClick={() => console.log("ciao")}>
      Homeeee
      <button
        onClick={() => {
          console.log("redirect");
          dispatch(push("/test"));
        }}
      >
        click
      </button>
    </Container>
  );
}
