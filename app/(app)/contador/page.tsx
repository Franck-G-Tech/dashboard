//import { Counter } from "./contadorSinHook";
import { Counter } from "./contadorConHook";
import { useCounter } from "@/hooks/useCounter";
export default function ContadorPage() {
  
  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <div>
        <Counter />
      </div>
      <div>
        <Counter />
      </div>
      <div>
        <Counter />
      </div>
      <p>hoooks</p>
        
    </div>
  );
}
