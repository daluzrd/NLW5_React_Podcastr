import React, { useState } from "react";

export default function Button({ title }) {
  const [counter, setCounter] = useState(1);

  function increment() {
    setCounter(counter + 1);
    console.log(counter);
  }

  return (
    <>
      <span>{counter}</span>
      <button onClick={increment}>{title}</button>
      <br />
    </>
  );
}
