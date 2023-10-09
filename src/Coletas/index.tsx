import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import {
  Collect,
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
  coletas: string[];
}

export function ColetaApp() {
  const [coletas, setColetas] = useState<string[]>([]);
  const [novaColeta, setNovaColeta] = useState("");
  const [nome, setNome] = useState("");
  const [id, setId] = useState("");
  const [userInfos, setUserInfos] = useState<User[]>([]);

  const handleAdicionarColeta = () => {
    if (novaColeta !== "") {
      setColetas([...coletas, novaColeta]);
      setNovaColeta("");
      // Atualize a série de dados do gráfico com as coletas atualizadas
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

    // Atualize a série de dados do gráfico com as coletas atualizadas
    const allColetas = updatedUserInfos.flatMap((user) => user.coletas);
    setColetas(allColetas);
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
              <p>{userInfo.nome}</p>
              <p>ID: {userInfo.id}</p>
              <h4>Coletas</h4>
              <ul>
                {userInfo.coletas.map((coleta, coletaIndex) => (
                  <li key={coletaIndex}>{coleta}</li>
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
