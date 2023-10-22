import React, { useMemo, useState } from "react";
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

  const handleAdicionarColeta = () => {
    if (novaColeta !== "") {
      const newColeta: Coleta = {
        id: Date.now().toString(),
        value: novaColeta,
      };
      setColetas([...coletas, newColeta]);
      setNovaColeta("");
      updateChartOptions();
    }
  };

  const handleAdicionarPessoa = () => {
    if (nome !== "" && id !== "") {
      const novaPessoa: User = { nome, id, coletas: [] };
      setUserInfos([...userInfos, novaPessoa]);
      setNome("");
      setId("");
    }
  };

  const handleAdicionarColetaUsuario = (userId: number) => {
    if (novaColeta !== "") {
      const updatedUserInfos = [...userInfos];
      const newColeta: Coleta = {
        id: Date.now().toString(),
        value: novaColeta,
      };
      updatedUserInfos[userId].coletas.push(newColeta);
      setUserInfos(updatedUserInfos);
      setNovaColeta("");
      updateChartOptions();
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
    updateChartOptions();
  };

  const handleExpandEquipment = (equipmentName: string) => {
    if (expandedEquipment === equipmentName) {
      setExpandedEquipment(null);
    } else {
      setExpandedEquipment(equipmentName);
    }
  };

  const updateChartOptions = () => {
    const updatedOptions: { [key: string]: any } = {};
    userInfos.forEach((userInfo) => {
      updatedOptions[userInfo.id] = {
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
            type: "line",
          },
        ],
      };
    });
    setOptions(updatedOptions);
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
            type: "line",
          },
        ],
      };
    });
    return options;
  }, [userInfos]);

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
          <h2>Equipamentos Adicionados</h2>
          {userInfos.map((userInfo, index) => (
            <UserCard key={index}>
              <p>
                <button onClick={() => handleExpandEquipment(userInfo.nome)}>
                  {userInfo.nome}
                </button>
              </p>
              {expandedEquipment === userInfo.nome && (
                <div>
                  <p>ID: {userInfo.id}</p>
                  <h4>Coletas</h4>
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
      </Sidebar>
      <GraphicsContainer>
        {userInfos.map((userInfo, index) => (
          <div key={index}>
            <h2>Equipamento ID: {userInfo.id}</h2>
            <ReactECharts option={chartOptions[userInfo.id]} />
          </div>
        ))}
      </GraphicsContainer>
    </Container>
  );
}
