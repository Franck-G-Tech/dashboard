"use client"
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <br />
      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button><br />
      <button onClick={() => setCount(count - 1)}>Decrementar</button>
    </div>
  );
}
