import { useState, useRef, useEffect } from "react";
import "./GiveToProduction.css";

const initialProductsDB = {
  123456: {
    name: "Widget A",
    location: "Shelf A1",
    boxes: [
      "123456-1",
      "123456-2",
      "123456-3",
      "123456-4",
      "123456-5",
      "123456-6",
    ],
  },
  789012: {
    name: "Gadget B",
    location: "Shelf B2",
    boxes: ["789012-1", "789012-2", "789012-3"],
  },
};

export function GiveToProduction() {
  const [productsDB, setProductsDB] = useState(initialProductsDB);
  const [scannedToday, setScannedToday] = useState([]);
  const [lastScanned, setLastScanned] = useState(null);
  const [preview, setPreview] = useState({
    visible: false,
    type: "",
    content: "",
  });
  const [filter, setFilter] = useState("");

  const inputRef = useRef(null);
  const beepSuccess = useRef(null);
  const beepError = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const findProductByBox = (barcode) => {
    for (let parentId in productsDB) {
      const product = productsDB[parentId];
      if (product.boxes.includes(barcode)) {
        return { parentId, product };
      }
    }
    return null;
  };

  const handleScan = (code) => {
    if (!code) return;

    const found = findProductByBox(code);
    if (!found) {
      setPreview({
        visible: true,
        type: "error",
        content: (
          <>
            <h2>Error</h2>
            <p>Box not found or already scanned out!</p>
          </>
        ),
      });
      beepError.current.play();
      return;
    }

    const { parentId, product } = found;

    // remove scanned box
    const updatedBoxes = product.boxes.filter((b) => b !== code);
    setProductsDB((prev) => ({
      ...prev,
      [parentId]: { ...product, boxes: updatedBoxes },
    }));

    // add scan record
    const newEntry = {
      boxBarcode: code,
      name: product.name,
      remaining: updatedBoxes.length,
    };
    setScannedToday((prev) => [...prev, newEntry]);
    setLastScanned({ parentId, barcode: code });

    setPreview({
      visible: true,
      type: "success",
      content: (
        <>
          <h2>{product.name}</h2>
          <p>
            <strong>Box:</strong> {code}
          </p>
          <p>
            <strong>Remaining:</strong> {updatedBoxes.length}
          </p>
        </>
      ),
    });
    beepSuccess.current.play();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleScan(e.target.value.trim());
      e.target.value = "";
    }
  };

  const undoLastScan = () => {
    if (!lastScanned) {
      alert("Nothing to undo!");
      return;
    }
    const { parentId, barcode } = lastScanned;

    setProductsDB((prev) => {
      const product = prev[parentId];
      return {
        ...prev,
        [parentId]: {
          ...product,
          boxes: [...product.boxes, barcode],
        },
      };
    });

    setScannedToday((prev) => {
      const index = prev.map((e) => e.boxBarcode).lastIndexOf(barcode);
      if (index !== -1) {
        const copy = [...prev];
        copy.splice(index, 1);
        return copy;
      }
      return prev;
    });

    setLastScanned(null);
    setPreview({ visible: false, type: "", content: "" });
  };

  const filteredEntries = scannedToday.filter(
    (e) => !filter || e.name === filter
  );
  const totalBoxes = filteredEntries.length;
  const uniqueProducts = new Set(filteredEntries.map((e) => e.name)).size;
  const productNames = [...new Set(scannedToday.map((e) => e.name))];

  return (
    <div id="gtp-container">
      <h1 id="pageHeader">Goods Scanning Out</h1>

      {/* Scanner */}
      <div id="scanningContainer">
        <input
          type="text"
          placeholder="Scan barcode here"
          ref={inputRef}
          onKeyPress={handleKeyPress}
          className="barcodeInput"
        />
        <button onClick={undoLastScan} className="inputButton">
          Undo Last Scan
        </button>
      </div>

      {/* Preview */}
      {preview.visible && (
        <div
          id="previewBox"
          style={{
            borderColor: preview.type === "success" ? "green" : "red",
          }}
        >
          {preview.content}
        </div>
      )}

      {/* Scanned List */}
      <div
        style={{
          background: "#fff",
          borderTop: "1px solid #ccc",
          padding: "0.5rem",
          fontSize: 13,
          height: "20vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: 14, margin: "0 0 0.5rem" }}>
          Scanned Out Today
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "20%",
            padding: "4px",
            marginBottom: "4px",
            fontSize: 13,
          }}
        >
          <option value="">All Products</option>
          {productNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>
                Box Barcode
              </th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>
                Product
              </th>
              <th style={{ border: "1px solid #ddd", padding: "4px" }}>
                Remaining
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, i) => (
              <tr key={i}>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {entry.boxBarcode}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {entry.name}
                </td>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "4px",
                    textAlign: "center",
                  }}
                >
                  {entry.remaining}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "0.5rem", fontWeight: "bold", fontSize: 13 }}>
          Total Boxes Scanned: {totalBoxes} | Unique Products: {uniqueProducts}
        </div>
      </div>

      {/* Sounds */}
      <audio
        ref={beepSuccess}
        src="https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
      />
      <audio
        ref={beepError}
        src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
      />
    </div>
  );
}
