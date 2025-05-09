import { TablaEstudiantes } from "@/components/tabla-estudiantes";
import Link from "next/link";

export default function ConfigPage() {
  return (
    <div className="flex min-h-[calc(70vh-5rem)] flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Sistema de Estudiantes</h1>
      <TablaEstudiantes />
      <br />
      <button className="mt-4 px-4 py-2 border rounded">
        <Link href="/">Ir a inicio</Link>
      </button>
    </div>
  );
}
