import { useState } from "react";
import { Cards } from "./styes";

export function Sidebar({
  handleclickAddItem,
  setSelectedPosition,
  cards,
}: any) {
  const [cardName, setCardName] = useState("");
  const [cardId, setCardId] = useState("");

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="ID:"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nome:"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
        />
        <button
          onClick={() => handleclickAddItem({ id: cardId, name: cardName })}
        >
          Adicionar
        </button>
      </div>
      <div>
        {cards.map((card: any) => (
          <Cards key={card.id} onClick={() => setSelectedPosition(card)}>
            <p>ID: {card.id}</p>
            <p>Nome: {card.name}</p>
          </Cards>
        ))}
      </div>
    </div>
  );
}
