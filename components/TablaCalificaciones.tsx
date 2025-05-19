import React from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import TablaCalificacionesAGGrid from "./TablaCalificacionesAGGrid"; // Importa el nuevo componente

const TablaCalificaciones = () => {
  const calificaciones  = useQuery(api.calificaciones.obtenerCalificaciones);

  return (
    <div>
      <h2>Lista de Calificaciones con AG Grid</h2>
      {calificaciones && <TablaCalificacionesAGGrid calificacionesData={calificaciones} />}
    </div>
  );
};

export default TablaCalificaciones;