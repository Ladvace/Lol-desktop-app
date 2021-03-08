import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { getAllChamps } from "../utils/helpers";
import Spinner from "../components/Spinner";
import LolLogo from "../../public/lol_logo.svg";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Home() {
  const [searching, setSearching] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [champs, setChamps] = useState({});
  const [champSelect, setChampSelect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllChamps().then(({ data }) => {
      setChamps(data.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.api.receive("joinedChampSelect", (e) => {
      setChampSelect(true);
    });
    window.api.receive("quittedChampSelect", (e) => {
      setChampSelect(false);
    });
    window.api.receive("startSearchingGame", (e) => {
      setSearching(true);
    });
    window.api.receive("stopSearchingGame", (e) => {
      setSearching(false);
    });
    window.api.receive("Accepted", (e) => {
      setAccepted(true);
      setTimeout(() => {
        setAccepted(false);
      }, 3000);
    });
    window.api.receive("Declined", (e) => {
      setDeclined(true);
      setTimeout(() => {
        setDeclined(false);
      }, 3000);
    });
  }, []);

  return (
    <Container>
      {searching && !accepted && !declined && <div>Searching</div>}
      {accepted && <div>Accepted</div>}
      {declined && <div>Declined</div>}
      {/* <FontAwesomeIcon size="5x" icon={faExclamationTriangle} /> */}
      <img
        css={`
          position: absolute;
          top: 80px;
          height: 50px;
        `}
        src={LolLogo}
      />
      {loading ? (
        <div>Loading</div>
      ) : (
        <Spinner duration={500} champions={champs} champSelect={champSelect} />
      )}

      {/* <button
        onClick={() => {
          console.log("redirect");
          // dispatch(push("/settings"));
        }}
      >
        click
      </button> */}
    </Container>
  );
}
