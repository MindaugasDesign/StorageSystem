import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./NewItem.css";

export function NewItem() {
  const [itemRivile, setItemRivile] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemSupplier, setItemSupplier] = useState("");
  const [itemUoM, setItemUoM] = useState("");
  const [itemPerson, setItemPerson] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const navigate = useNavigate();

  const newItemFunction = (e) => {
    e.preventDefault();
    setItemRivile("");
    setItemName("");
    setItemId("");
    setItemSupplier("");
    setItemUoM("");
    setItemPerson("");
    setItemLocation("");

    const newItem = {
      rivile: itemRivile,
      name: itemName,
      itemId: itemId,
      supplier: itemSupplier,
      UoM: itemUoM,
      packages: [],
      stockkeeper: itemPerson,
      location: itemLocation,
    };
    navigate("/main");

    fetch("http://localhost:7750/createNewItem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    });
  };

  return (
    <>
      <div className="newItem_Title">
        <h1>Hello add new item</h1>
      </div>
      <div className="newItem_Form">
        <form id="newItemCreate" onSubmit={(e) => newItemFunction(e)}>
          <input
            type="text"
            name="rivile"
            id="rivile"
            placeholder="Rivilė"
            value={itemRivile}
            onChange={(e) => setItemRivile(e.target.value)}
          />
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Pavadinimas"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            type="text"
            name="itemId"
            id="itemId"
            placeholder="Išorinis kodas"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />
          <input
            type="text"
            name="supplier"
            id="supplier"
            placeholder="Tiekėjas"
            value={itemSupplier}
            onChange={(e) => setItemSupplier(e.target.value)}
          />
          <input
            type="text"
            name="UoM"
            id="UoM"
            placeholder="Mato vienetas"
            value={itemUoM}
            onChange={(e) => setItemUoM(e.target.value)}
          />
          <input
            type="text"
            name="keeper"
            id="keeper"
            placeholder="Atsakingas Asmuo"
            value={itemPerson}
            onChange={(e) => setItemPerson(e.target.value)}
          />
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Lokacija"
            value={itemLocation}
            onChange={(e) => setItemLocation(e.target.value)}
          />

          <input type="submit" value="Pridėti" />
        </form>
      </div>
    </>
  );
}
