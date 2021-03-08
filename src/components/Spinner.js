import React, { useEffect, useState } from "react";
import useKey from "@rooks/use-key";
import { getChampImage } from "../utils/helpers";

const Spinner = ({ duration, champions, champSelect }) => {
  const [champs, setChamps] = useState([]);
  const [item, setItem] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useKey(["Enter", "Space"], () => pickItem());

  let startTime;
  let fps = 60;
  let now;
  let then = Date.now();
  let interval = 1000 / fps;
  let delta;

  const spin = (timestamp, duration) => {
    timestamp = timestamp || new Date().getTime();

    let runTime = timestamp - startTime;
    let progress = runTime / duration;

    progress = Math.min(progress, 1);

    // check if run time is met
    if (runTime < duration) {
      requestAnimationFrame((timestamp) => {
        spin(timestamp, duration);
      });
    }

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      const randomChamp = champs[Math.floor(Math.random() * champs.length)];
      setItem(randomChamp);
    }
  };

  const champName = item
    .split("/")
    [item.split("/").length - 1].replace(".png", "");

  const champInfo = champions[champName];

  const pickItem = () => {
    console.log(champSelect, error);
    if (champSelect) {
      setError(false);

      requestAnimationFrame((timestamp) => {
        startTime = timestamp || new Date().getTime();
        spin(startTime, duration);
        setTimeout(() => {
          console.log(champInfo);
          window.api.send("lockChamp", champInfo?.id);
        }, duration);
      });
    } else setError(true);
  };

  useEffect(() => {
    Object.keys(champions).forEach((champName) => {
      const image = getChampImage(champName);
      setChamps((prev) => [...prev, image]);
      setLoading(false);
    });
  }, []);

  return (
    <div
      css={`
        height: 120px;
        width: 120px;
        border: 5px solid white;
      `}
      onClick={() => pickItem()}
    >
      {!loading && (
        <div
          css={`
            cursor: pointer;
            text-align: center;
          `}
        >
          {(item === "" || error) && (
            <div
              css={`
                display: flex;
                width: 120px;
                height: 120px;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
              `}
            >
              {!error ? (
                <div>
                  CLICK
                  <br />
                  HERE
                </div>
              ) : (
                <div>JOIN A LOBBY</div>
              )}
            </div>
          )}
          {!error && (
            <>
              <img src={item} />
              <h2>{champName}</h2>
              <div>
                {champInfo?.tags &&
                  champInfo?.tags.map((type) => <p key={type}>{type}</p>)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Spinner;
