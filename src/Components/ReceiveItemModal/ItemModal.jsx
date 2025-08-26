import { useState } from "react";
import "./ItemModal.css";
import { useEffect } from "react";

export function ItemModal({ userData, submitItem }) {
  const [itemValue, setItemValue] = useState("");
  const [quantityPackages, setQuantityPackages] = useState("");
  const [packageQuantity, setItemQuantity] = useState([]);
  const [dateOfArrival, setDateOfArrival] = useState("");
  const [containerName, setContainerName] = useState("");
  const [paperSize, setPaperSize] = useState("");

  const [whDb, setWarehouseDB] = useState([]);
  useEffect(() => {
    fetch("http://localhost:7750/items")
      .then((res) => res.json())
      .then((data) => {
        setWarehouseDB(data);
      });
  }, []);

  const handleQuantityChange = (index, value) => {
    const updatedQuantities = [...packageQuantity];
    updatedQuantities[index] = value;
    setItemQuantity(updatedQuantities);
  };
  const existingBarcodes = whDb.flatMap((item) =>
    item.packages.map((pkg) => pkg.barcode)
  );

  function barcodeCreator() {
    const randomNumber = Math.floor(Math.random() * 100000);
    return `EK-${randomNumber.toString().padStart(6, "0")}`;
  }

  // Ensures the generated barcode is unique
  function getUniqueBarcode() {
    let barcode;
    do {
      barcode = barcodeCreator();
    } while (existingBarcodes.includes(barcode));

    // Add it to the array so next generated barcode won't duplicate
    existingBarcodes.push(barcode);
    return barcode;
  }

  const handleItemForm = (e) => {
    e.preventDefault();

    if (!itemValue) {
      alert("Select an Item");
      return;
    }

    if (!paperSize) {
      alert("Select label size");
      return;
    }

    const loggedUser = localStorage.getItem("LoggedUser");

    const itemObjects = packageQuantity.map((qty, index) => ({
      rivile: itemValue,
      shippingRemarks: containerName,
      DoA: dateOfArrival,
      quantity: qty,
      receivedBy: loggedUser,
      barcode: getUniqueBarcode(),
      paperSize: paperSize,
    }));
    submitItem(itemObjects);
    setItemValue("");
    setQuantityPackages("");
    setItemQuantity([]);
    setContainerName("");
    setDateOfArrival("");
    setPaperSize("");
  };

  const packageArray = [];
  if (quantityPackages > 0) {
    for (let i = 0; i < quantityPackages; i++) {
      packageArray.push(i);
    }
  }

  return (
    <div id="itemModal" className="modal">
      <div className="content-modal">
        <span className="close">&times;</span>
        <h2 className="modalHeader">Select Data</h2>
        <div className="receiveItemCont">
          <form id="newItem" onSubmit={(e) => handleItemForm(e)}>
            <select
              name="paperSize"
              id="paperSize"
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value)}
            >
              <option value="">Select paper size</option>
              <option value="A4">A4 paper</option>
              <option value="label">Label printer</option>
            </select>
            <select
              name="items"
              id="items"
              value={itemValue}
              onChange={(e) => setItemValue(e.target.value)}
            >
              <option value="">Select an item</option>
              {userData.map((item, index) => (
                <option key={index} value={item.rivile}>
                  {item.rivile}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="contName"
              id="contName"
              placeholder="Container Name"
              value={containerName}
              onChange={(e) => setContainerName(e.target.value)}
            />
            <input
              type="date"
              name="DoA"
              id="DoA"
              placeholder="Date of Arrival"
              value={dateOfArrival}
              onChange={(e) => setDateOfArrival(e.target.value)}
            />
            <input
              type="number"
              name="packageCount"
              id="packageCount"
              placeholder="How many boxes"
              value={quantityPackages}
              onChange={(e) => setQuantityPackages(e.target.value)}
            />
            {packageArray.map((_, index) => (
              <Package
                key={index}
                index={index}
                quantity={packageQuantity[index] || ""}
                onQuantityChange={handleQuantityChange}
              />
            ))}
            <input type="submit" value="Add Item" />
          </form>
        </div>
      </div>
    </div>
  );
}
function Package({ index, quantity, onQuantityChange }) {
  return (
    <input
      type="number"
      name={`quantity-${index}`}
      placeholder={`Quantity for package ${index + 1}`}
      value={quantity}
      onChange={(e) => onQuantityChange(index, e.target.value)}
    />
  );
}
