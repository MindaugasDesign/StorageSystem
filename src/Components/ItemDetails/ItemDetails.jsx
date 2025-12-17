import { useLocation, useNavigate } from "react-router-dom";
import "./ItemDetails.css";

import { useState } from "react";
import detailsLogo from "/src/assets/clipboard-svgrepo-com.svg";

export function ItemDetails() {
  const [userRole, setUserRole] = useState(localStorage.getItem("Power"));

  const location = useLocation();
  const navigate = useNavigate();
  const { data = [], itemName, itemUnit, itemRivile } = location.state || {};
  const canUse = ["Admin", "Supervisor", "Purchaser"].includes(userRole);

  const detailBtn = () => {
    navigate("/item_log", {
      state: { itemRivile: itemRivile },
    });
  };

  // Group items by shippingRemarks
  const groupedData = data.reduce((acc, item) => {
    const remark = item.shippingRemarks || "No Remark";
    if (!acc[remark]) acc[remark] = [];
    acc[remark].push(item);
    return acc;
  }, {});

  const sortedRemarks = Object.keys(groupedData).sort((a, b) =>
    a.localeCompare(b)
  );

  return (
    <>
      <div className="itemDetailsHeader">
        <h2 id="open_Item">{itemName}</h2>
        {canUse && (
          <div className="detailLogo" onClick={detailBtn}>
            <img src={detailsLogo} alt="" />
            <p>Details</p>
          </div>
        )}
      </div>

      <div id="list_Container">
        {sortedRemarks.map((remark) => {
          const items = groupedData[remark];
          const firstDate = items[0]?.DoA; // take first item's date

          return (
            <div key={remark} className="remarkGroup">
              <h3 className="remarkTitle">{remark}</h3>
              {firstDate && <h4 className="remarkDate">{firstDate}</h4>}
              <ul className="remarkList">
                {items.map((item) => (
                  <li key={item.barcode} className="itemListEntry">
                    {item.barcode} — {item.quantity} {itemUnit}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
