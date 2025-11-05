import { useEffect, useState } from "react";
import "./ReceivedItemLog.css";
import downBtn from "/src/assets/list-arrow-down-svgrepo-com.svg";
import upBtn from "/src/assets/list-arrow-up-minimalistic-svgrepo-com.svg";
import { useLocation } from "react-router";

export function ReceiveItemLog() {
  const location = useLocation();
  const itemRivile = location.state || {};

  const [allItems, setAllItems] = useState([]);
  const [allLogs, setAllLogs] = useState([]);

  // Fetch warehouse items
  useEffect(() => {
    fetch("http://localhost:7750/items")
      .then((res) => res.json())
      .then((data) => setAllItems(data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Fetch logs
  useEffect(() => {
    fetch("http://localhost:7750/itemLogs")
      .then((res) => res.json())
      .then((logs) => setAllLogs(logs))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  // Filter by rivile
  const openedItem = allItems.filter(
    (item) => item.rivile === itemRivile.itemRivile
  );

  return (
    <>
      <div className="page_Header">
        <h1>{itemRivile.itemRivile}</h1>
      </div>

      <div className="itemLoc">
        <ul className="listux">
          {openedItem.map((item, index) => {
            // Group all packages by unique shippingRemarks
            const uniqueRemarks = [
              ...new Set([
                ...item.packages.map((p) => p.shippingRemarks),
                ...allLogs
                  .filter((l) => l.rivile === item.rivile)
                  .map((l) => l.shippingRemarks),
              ]),
            ];

            return uniqueRemarks.map((remark, i) => {
              // Get packages from warehouse
              const packagesFromWarehouse = item.packages.filter(
                (p) => p.shippingRemarks === remark
              );

              // Get packages from logs that are scanned out
              const packagesFromLogs = allLogs.filter(
                (l) =>
                  l.rivile === item.rivile &&
                  l.shippingRemarks === remark &&
                  l.status === "scanned_out"
              );

              // Merge both
              const mergedPackages = [
                ...packagesFromWarehouse.map((p) => ({
                  ...p,
                  status: "Available",
                })),
                ...packagesFromLogs.map((l) => ({ ...l })), // scanned_out packages
              ];

              return (
                <li className="listis" key={`${index}-${i}`}>
                  <ItemView
                    item={item}
                    remark={remark}
                    packages={mergedPackages}
                  />
                </li>
              );
            });
          })}
        </ul>
      </div>
    </>
  );
}

function ItemView({ item, remark, packages }) {
  const [open, setOpen] = useState(false);

  const totalQuantity = packages.reduce(
    (sum, pkg) => sum + Number(pkg.quantity),
    0
  );

  return (
    <div className="itemDetailed">
      <div className="headerInfo">
        <p className="item__Name">{item.name}</p>
        <p className="item__Info">{item.supplier}</p>
        <p className="item__Location">{item.location}</p>
        <p className="item__Remarks">
          <strong>Remarks:</strong> {remark}
        </p>
        <p className="item__Amount">{totalQuantity} vnt.</p>

        <img
          src={open ? upBtn : downBtn}
          alt="Details button"
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && (
        <div className="details_Visable">
          {packages.map((pkg, i) => {
            return (
              <div
                className={`boxDetails ${
                  pkg.status === "scanned_out" ? "scannedOut" : ""
                }`}
                key={i}
              >
                <p className="box__Barcode">
                  <strong>Barcode:</strong> {pkg.barcode}
                </p>
                <p className="box__Vacancy">
                  <strong>Date:</strong> {pkg.DoA}
                </p>
                <p className="box__Amount">
                  <strong>Quantity:</strong> {pkg.quantity}
                </p>
                <p className="box__Receiver">
                  <strong>Received by:</strong> {pkg.receivedBy}
                </p>

                {pkg.status && (
                  <p className="box__Status">
                    <strong>Status:</strong> {pkg.status}
                  </p>
                )}

                {pkg.history && (
                  <p className="box__History">
                    <strong>History:</strong>{" "}
                    {pkg.history
                      .map(
                        (h) =>
                          `${h.status} (${new Date(
                            h.date
                          ).toLocaleDateString()})`
                      )
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
