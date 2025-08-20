import { useEffect, useState } from "react";
// import data from "/src/assets/warehouse.json";
import { useNavigate } from "react-router-dom";
import "./Homescreen.css";
import editBtn from "/src/assets/edit-2-svgrepo-com.svg";
import deletBtn from "/src/assets/delete-2-svgrepo-com.svg";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function calculateQuantity(arrays) {
  return arrays.reduce((acc, { quantity }) => acc + Number(quantity), 0);
}

export function Homescreen() {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [warehouseData, setWarehouseData] = useState([]);
  const navigate = useNavigate();
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("Power");
    if (user === "Admin" || user === "Accounting") {
      setShowControls(true);
    } else {
      setShowControls(false);
    }
  }, []);

  function openDetails(item, itemName, unit, itemRivile) {
    navigate("/details", {
      state: {
        data: item,
        itemName: itemName,
        itemUnit: unit,
        itemRivile: itemRivile,
      },
    });
  }

  useEffect(() => {
    fetch("http://localhost:7750/items")
      .then((res) => res.json())
      .then((data) => {
        setWarehouseData(data);
      });
  }, []);

  return (
    <>
      <div className="table_Wrapper">
        <div id="pageTitle">
          <h1 id="page_Date">{currentDate}</h1>
          <h2>Warehouse material list</h2>
        </div>
        <div id="stock_Table">
          <table id="wh_Stock">
            <thead className="table_Headers">
              <tr className="header_Row">
                <th>Rivilė</th>
                <th>Pavadinimas</th>
                <th>Išorinis kodas</th>
                <th>Tiekėjas</th>
                <th>Mato vienetas</th>
                <th>Kiekis</th>
                <th>Informacija</th>
                <th>Lokacija</th>
              </tr>
            </thead>
            <tbody className="table_Contents">
              {warehouseData.map((item, index) => (
                <tr className="body_Row" key={index}>
                  <td>{item.rivile}</td>
                  <td>{item.name}</td>
                  <td>{item.itemId}</td>
                  <td>{item.supplier}</td>
                  <td>{item.UoM}</td>
                  <td>{calculateQuantity(item.packages)}</td>
                  <td
                    className="detail_Row"
                    onClick={() =>
                      openDetails(
                        item.packages,
                        item.name,
                        item.UoM,
                        item.rivile
                      )
                    }
                  >
                    More Info
                  </td>
                  <td>{item.location}</td>
                  {showControls && (
                    <td className="item__Controls">
                      <div className="edit_Btn">
                        <img src={editBtn} alt="Edit Button" />
                      </div>
                      <div className="delete_Btn">
                        <img src={deletBtn} alt="Delete Button" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
