import { useEffect, useState, useMemo } from "react";
import "./ScanOutReport.css";

export function ScanOutReport() {
  const BACKEND = `http://${window.location.hostname}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;

  const [scannedData, setScannedData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch all scanned logs
  useEffect(() => {
    fetch(`${BACKEND}/itemlogs`)
      .then((res) => res.json())
      .then(setScannedData)
      .catch(console.error);
  }, [BACKEND]);

  // Get unique scanned-out dates in ISO format
  const scannedDates = useMemo(() => {
    return [
      ...new Set(
        scannedData
          .filter((log) => log.status === "scanned_out" && log.scannedOutDate)
          .map((log) => new Date(log.scannedOutDate).toISOString().slice(0, 10))
      ),
    ].sort((a, b) => a.localeCompare(b)); // oldest first
  }, [scannedData]);

  // Filter logs by selected date
  const scannedOutLogs = selectedDate
    ? scannedData.filter(
        (log) =>
          log.status === "scanned_out" &&
          new Date(log.scannedOutDate).toISOString().slice(0, 10) ===
            selectedDate
      )
    : [];

  // Format time as HH:MM
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <h1>Scan Out Log</h1>

      {/* Date selector */}
      <div className="scanOutFilter">
        <label>
          Date:{" "}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="" disabled>
              Select a date
            </option>
            {scannedDates.map((date) => (
              <option key={date} value={date}>
                {date} {/* ISO format YYYY-MM-DD */}
              </option>
            ))}
          </select>
        </label>

        {selectedDate && (
          <button onClick={() => setSelectedDate("")}>Clear</button>
        )}
      </div>

      {/* Info */}
      {selectedDate && <p>{scannedOutLogs.length} records found</p>}

      {/* Table */}
      {selectedDate ? (
        <table>
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Rivilė</th>
              <th>Time</th>
              <th>Scanned Out By</th>
            </tr>
          </thead>

          <tbody>
            {scannedOutLogs.map((log) => (
              <tr key={log.id || log.barcode}>
                <td className="scannedRow_Text">{log.barcode}</td>
                <td className="scannedRow_Text">{log.rivile}</td>
                <td className="scannedRow_Text">
                  {log.scannedOutDate ? formatTime(log.scannedOutDate) : "—"}
                </td>
                <td className="scannedRow_Text">{log.scannedOutBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ opacity: 0.6 }}>Select a date to view scanned-out logs.</p>
      )}
    </>
  );
}
