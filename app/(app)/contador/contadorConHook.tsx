"use client"
import { useCounter } from "@/hooks/useCounter";

export function Counter() {
  const { count, increment, decrement, reset } = useCounter(5);

  return (
    <div>
      <p>Contador: {count}</p>
      <button onClick={increment}>Incrementar</button>
      <button onClick={decrement}>Decrementar</button>
      <button onClick={reset}>Resetear</button>
    </div>
  );
}
