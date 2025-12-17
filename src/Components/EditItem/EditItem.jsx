import { useState, useEffect } from "react";
import "./EditItem.css";

export function EditItem({ item, onClose, onUpdate }) {
  const [itemRivile, setItemRivile] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemId, setItemId] = useState("");
  const [itemSupplier, setItemSupplier] = useState("");
  const [itemUoM, setItemUoM] = useState("");
  const [itemPerson, setItemPerson] = useState("");
  const [itemLocation, setItemLocation] = useState("");

  const BACKEND = `http://${window.location.hostname}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;

  useEffect(() => {
    if (item) {
      setItemRivile(item.rivile || "");
      setItemName(item.name || "");
      setItemId(item.itemId || "");
      setItemSupplier(item.supplier || "");
      setItemUoM(item.UoM || "");
      setItemPerson(item.stockkeeper || "");
      setItemLocation(item.location || "");
    }
  }, [item]);

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        if (onClose) onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedItem = {
      rivile: itemRivile,
      name: itemName,
      itemId,
      supplier: itemSupplier,
      UoM: itemUoM,
      stockkeeper: itemPerson,
      location: itemLocation,
      packages: item.packages || [],
    };

    fetch(`${BACKEND}/items/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then((data) => {
        if (onUpdate) onUpdate(data); // update table in Homescreen
        if (onClose) onClose(); // close modal
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="modals">
      <div className="content-modals">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="modalHeader">Edit Item</h2>
        <div className="receiveItemCont">
          <form id="editItemForm" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Rivilė"
              value={itemRivile}
              onChange={(e) => setItemRivile(e.target.value)}
            />
            <input
              type="text"
              placeholder="Pavadinimas"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Išorinis kodas"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tiekėjas"
              value={itemSupplier}
              onChange={(e) => setItemSupplier(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mato vienetas"
              value={itemUoM}
              onChange={(e) => setItemUoM(e.target.value)}
            />
            <input
              type="text"
              placeholder="Atsakingas Asmuo"
              value={itemPerson}
              onChange={(e) => setItemPerson(e.target.value)}
            />
            <input
              type="text"
              placeholder="Lokacija"
              value={itemLocation}
              onChange={(e) => setItemLocation(e.target.value)}
            />
            <input type="submit" value="Save Changes" />
          </form>
        </div>
      </div>
    </div>
  );
}
