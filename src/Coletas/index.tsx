import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Container,
  GraphicsContainer,
  Sidebar,
  UserInfo,
  UserCard,
} from "./styles";

// Defina um tipo para o usuário
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

      // Atualize a série de dados do gráfico com as coletas atualizadas
      const options = {
        xAxis: {
          type: "category",
          data: updatedColetas, // Atualize as coletas
        },
        series: [
          {
            data: updatedColetas.map((coleta) => parseInt(coleta)), 
            type: "line",
          },
        ],
        
      };
      setOptions(options); // Atualize as opções do gráfico
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
    const updatedUserInfos = [...userInfos];
    updatedUserInfos[userId].coletas.push(novaColeta);
    setUserInfos(updatedUserInfos);
    setNovaColeta("");

    const allColetas = updatedUserInfos.flatMap((user) => user.coletas);
    const options = {
      xAxis: {
        type: "category",
        data: allColetas, // Atualize as Coletas no eixo X 
      series: [
        {
          data: allColetas.map((coleta) => parseInt(coleta)), // Atualize os dados das coletas
          type: "line",
        },
      ],
    };
    setOptions(options); // Atualize as opções do gráfico
  };

  const handleRemoverColetaUsuario = (
    userId: number,
    coletaToDelete: string
  ) => {
    const updatedUserInfos = [...userInfos];
    const userToUpdate = updatedUserInfos[userId];

    //Filtrar os dados da coleta

    userToUpdate.coletas = userToUpdate.coletas.filter(
      (coleta) => coleta !== coletaToDelete
    );

    setUserInfos(updatedUserInfos);

    const allColetas = updatedUserInfos.flatMap((user) => user.coletas);
    const options = {
      xAxis: {
        type: "category",
        data: allColetas,
      },
      series: [
        {
          data: allColetas.map((coleta) => parseInt(coleta)),
          type: "line",
        },
      ],
    };
    setOptions(options);
  };

  const handleExpandEquipment = (equipmentName: string) => {
    if (expandedEquipment === equipmentName) {
      setExpandedEquipment(null); // Ao clicar no nome expandir
    } else {
      setExpandedEquipment(equipmentName); // se não estiver expandido, expandir
    }
  };

  const [options, setOptions] = useState({
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
  });

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
                        {coleta}
                        <button
                          onClick={() =>
                            handleRemoverColetaUsuario(index, coleta)
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
        <ReactECharts option={options} />
      </GraphicsContainer>
    </Container>
  );
}
