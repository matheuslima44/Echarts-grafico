import { useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Container,
  GraphicsContainer,
  Sidebar,
  UserInfo,
  UserCard,
} from "./styles";

interface User {
  nome: string;
  id: string;
  coletas: Coleta[];
}

interface Coleta {
  id: string;
  value: string;
}

export function ColetaApp() {
  const [coletas, setColetas] = useState<Coleta[]>([]);
  const [novaColeta, setNovaColeta] = useState("");
  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [userInfos, setUserInfos] = useState<User[]>([]);
  const [expandedEquipment, setExpandedEquipment] = useState<string | null>(
    null
  );
  const [chartType, setChartType] = useState("line");

  const handleAdicionarColeta = () => {
    if (novaColeta !== "") {
      const newColeta: Coleta = {
        id: Date.now().toString(),
        value: novaColeta,
      };
      setColetas([...coletas, newColeta]);
      setNovaColeta("");
    }
  };
  console.log(handleAdicionarColeta);

  const handleAdicionarPessoa = () => {
    if (nome !== "" && id !== "") {
      const novaPessoa: User = { nome, id, coletas: [] };
      setUserInfos([...userInfos, novaPessoa]);
      setNome("");
      setId("");
    }
  };

  const handleAdicionarColetaUsuario = (userId: number) => {
    if (/[0-9]+$/.test(novaColeta)) {
      //test, é utilizado para testar as strings, até achar um erro.
      const updatedUserInfos = [...userInfos];
      const newColeta: Coleta = {
        id: Date.now().toString(),
        value: novaColeta,
      };
      updatedUserInfos[userId].coletas.push(newColeta);
      setUserInfos(updatedUserInfos);
      setNovaColeta("");
    } else {
      alert("Digite Apenas numeros");
    }
  };

  const handleRemoverColetaUsuario = (
    userId: number,
    coletaToDelete: string
  ) => {
    const updatedUserInfos = [...userInfos];
    const userToUpdate = updatedUserInfos[userId];
    userToUpdate.coletas = userToUpdate.coletas.filter(
      (coleta) => coleta.id !== coletaToDelete
    );
    setUserInfos(updatedUserInfos);
  };

  const handleExpandEquipment = (equipmentName: string) => {
    if (expandedEquipment === equipmentName) {
      setExpandedEquipment(null);
    } else {
      setExpandedEquipment(equipmentName);
    }
  };

  const toggleChartType = () => {
    setChartType(chartType === "line" ? "bar" : "line");
  };

  const chartOptions = useMemo(() => {
    const options: { [key: string]: any } = {};
    userInfos.forEach((userInfo) => {
      options[userInfo.id] = {
        title: {
          text: `Gráfico de Coletas - ID: ${userInfo.id}`,
        },
        xAxis: {
          type: "category",
          data: userInfo.coletas.map((coleta) => coleta.value),
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: userInfo.coletas.map((coleta) => parseInt(coleta.value)),
            type: chartType,
          },
        ],
      };
    });
    return options;
  }, [userInfos, chartType]);

  return (
    <Container>
      <Sidebar>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button onClick={handleAdicionarPessoa}>Adicionar Equipamento</button>
        <UserInfo>
          <h3>Equipamentos Adicionados:</h3>
          {userInfos.map((userInfo, index) => (
            <UserCard key={index}>
              <p>
                <button onClick={() => handleExpandEquipment(userInfo.nome)}>
                  {userInfo.nome}
                </button>
              </p>
              {expandedEquipment === userInfo.nome && (
                <div>
                  <ul>
                    {userInfo.coletas.map((coleta, coletaIndex) => (
                      <li key={coletaIndex}>
                        {coleta.value}
                        <button
                          onClick={() =>
                            handleRemoverColetaUsuario(index, coleta.id)
                          }
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div>
                    <input
                      type="text"
                      placeholder="Adicionar Coleta"
                      value={novaColeta}
                      onChange={(e) => setNovaColeta(e.target.value)}
                    />
                    <button onClick={() => handleAdicionarColetaUsuario(index)}>
                      Adicionar Coleta
                    </button>
                  </div>
                </div>
              )}
            </UserCard>
          ))}
        </UserInfo>
        <button onClick={toggleChartType}>
          Line || Bar ({chartType === "line" ? "Bar" : "Line"})
        </button>
      </Sidebar>
      <GraphicsContainer>
        {userInfos.map((userInfo, index) => (
          <div key={index}>
            {expandedEquipment === userInfo.nome && (
              <ReactECharts option={chartOptions[userInfo.id]} />
            )}
            {/* Expandir Grafico por id */}
          </div>
        ))}
      </GraphicsContainer>
    </Container>
  );
}
