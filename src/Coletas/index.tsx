import React, { useState } from "react";
import ReactECharts from "echarts-for-react";

export function ColetaApp() {
  const [coletas, setColetas] = useState([]);
  const [novaColeta, setNovaColeta] = useState<string>("");

  const handleAdicionarColeta = () => {
    if (novaColeta !== "") {
      setColetas([...coletas, novaColeta]);
      setNovaColeta("");
    }
  };

  const options = {
    title: {
      text: "Gráfico de Coletas",
    },
    xAxis: {
      type: "category",
      data: coletas,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: coletas.map((coleta) => parseInt(coleta)),
        type: "line",
      },
    ],
  };

  return (
    <div>
      <h1>Aplicação de Coletas</h1>
      <div>
        <input
          type="text"
          placeholder="Digite uma coleta"
          value={novaColeta}
          onChange={(e) => setNovaColeta(e.target.value)}
        />
        <button onClick={handleAdicionarColeta}>Adicionar Coleta</button>
      </div>
      <div style={{ height: "400px" }}>
        <ReactECharts option={options} />
      </div>
    </div>
  );
}
