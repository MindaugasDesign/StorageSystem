import { useState, useRef, useEffect } from "react";
import "./GiveToProduction.css";

export function GiveToProduction() {
  const [productsDB, setProductsDB] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [preview, setPreview] = useState({
    visible: false,
    type: "",
    content: "",
  });
  const [filter, setFilter] = useState("");

  const inputRef = useRef(null);

  const BACKEND = `http://${window.location.hostname}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;

  // Fetch warehouse items
  useEffect(() => {
    fetch(`${BACKEND}/items`)
      .then((res) => res.json())
      .then(setProductsDB)
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch logs and filter today's scanned-out items
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BACKEND}/itemLogs`);
        const logs = await res.json();

        const today = new Date().toDateString();

        // Filter logs where scannedOutDate is today
        const filtered = logs.filter(
          (log) =>
            log.status === "scanned_out" &&
            log.scannedOutDate &&
            new Date(log.scannedOutDate).toDateString() === today
        );

        setTodayLogs(filtered);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = async (code) => {
    if (!code) return;

    const found = productsDB.find((product) =>
      product.packages.some((p) => p.barcode === code)
    );

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
      return;
    }

    const updatedPackages = found.packages.filter((p) => p.barcode !== code);
    const user = localStorage.getItem("LoggedUser");

    try {
      // DELETE the package (scanning out)
      const res = await fetch(
        `${BACKEND}/items/${found._id}/packages/${code}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete from DB");

      // Log scan-out event
      await fetch(`${BACKEND}scanOutLog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: code, scannedBy: user }),
      });

      // Update state
      setProductsDB((prev) =>
        prev.map((p) =>
          p._id === found._id ? { ...p, packages: updatedPackages } : p
        )
      );

      setPreview({
        visible: true,
        type: "success",
        content: (
          <>
            <h2>{found.name}</h2>
            <p>
              <strong>Box:</strong> {code}
            </p>
            <p>
              <strong>Remaining:</strong> {updatedPackages.length}
            </p>
          </>
        ),
      });
    } catch (err) {
      console.error("Error scanning out:", err);
      setPreview({
        visible: true,
        type: "error",
        content: (
          <>
            <h2>Database Error</h2>
            <p>Could not remove package from MongoDB!</p>
          </>
        ),
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleScan(e.target.value.trim());
      e.target.value = "";
    }
  };

  const filteredLogs = todayLogs.filter(
    (log) => !filter || log.rivile === filter
  );

  const productNames = [...new Set(todayLogs.map((l) => l.rivile))];

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

      {/* Scanned Out Today */}
      <div id="scanned_box">
        <h2 className="scanned_header">Scanned Out Today</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="scannedList"
        >
          <option value="">All Products</option>
          {productNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <table id="scannedTable">
          <thead>
            <tr>
              <th className="scannedRow">Barcode</th>
              <th className="scannedRow">Product</th>
              <th className="scannedRow">Date</th>
              <th className="scannedRow">Scanned By</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, i) => (
              <tr key={i}>
                <td className="scannedRow_Text">{log.barcode}</td>
                <td className="scannedRow_Text">{log.rivile}</td>
                <td className="scannedRow_Text">
                  {new Date(log.scannedOutDate).toLocaleTimeString()}
                </td>
                <td className="scannedRow_Text">{log.scannedOutBy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="scannedTotals">
          Total Scanned Today: {filteredLogs.length} | Unique Products:{" "}
          {new Set(filteredLogs.map((l) => l.rivile)).size}
        </div>
      </div>
    </div>
  );
}
