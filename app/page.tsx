import Link from "next/link";

export default function Home() {
  const lisTablas = [
    "estudiantes",
    "maestros",
    "horarios",
    "materias",
    "salones",
  ];
  const tablas = [...lisTablas].sort((a, b) => a.localeCompare(b));

  return (
    <main className="container mx-auto py-10 rounded-md border w-3/5">
      <span className="text-3xl font-bold mr-20">Sistema de </span>{" "}
      <div className="flex min-h-[calc(80vh-5rem)] flex-col items-center justify-center ">
        {tablas.map((tabla) => (
          <div key={tabla} className="flex items-center mb-8">
            <div className="flex items-center justify-center">
              {" "}
              {/* Contenedor para centrar el botón */}
              <button className="">
                <Link
                  href={`/${tabla}`}
                  className="text-3xl font-bold mr-20 px-4 py-2 border rounded ml-4 capitalize"
                >
                  {tabla}
                </Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
