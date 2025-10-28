import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homescreen.css";
import editBtn from "/src/assets/edit-2-svgrepo-com.svg";
import deletBtn from "/src/assets/delete-2-svgrepo-com.svg";
import { FindItem } from "../FindItem/FindItem";
import { EditItem } from "../EditItem/EditItem";

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const date = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${date}`;
}

function calculateQuantity(arrays) {
  if (!Array.isArray(arrays)) return 0;
  return arrays.reduce((acc, { quantity }) => acc + Number(quantity), 0);
}

export function Homescreen({ tableRef }) {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [warehouseData, setWarehouseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("Power");
    setShowControls(user === "Admin");
  }, []);

  useEffect(() => {
    fetch("http://localhost:7750/items")
      .then((res) => res.json())
      .then((data) => {
        setWarehouseData(data);
        setFilteredData(data);
      });
  }, []);

  const openDetails = (item, itemName, unit, itemRivile) => {
    navigate("/details", {
      state: { data: item, itemName, itemUnit: unit, itemRivile },
    });
  };

  const deleteItem = async (itemId) => {
    setWarehouseData((prev) => prev.filter((i) => i._id !== itemId));
    setFilteredData((prev) => prev.filter((i) => i._id !== itemId));

    try {
      const res = await fetch(`http://localhost:7750/items/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (err) {
      console.error(err);
    }
  };

  const sortedData = [...filteredData].sort((a, b) =>
    a.rivile.localeCompare(b.rivile)
  );

  return (
    <>
      <div className="table_Wrapper">
        <div id="pageTitle">
          <h1 id="page_Date">{currentDate}</h1>
          <div className="filterSection">
            <h2>Warehouse material list</h2>
            <FindItem data={warehouseData} onFilter={setFilteredData} />
          </div>
        </div>

        <div id="stock_Table">
          <table id="wh_Stock" ref={tableRef}>
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
                {showControls && <th>Valdymas</th>}
              </tr>
            </thead>
            <tbody className="table_Contents">
              {sortedData.map((item, index) => (
                <tr key={index} className="body_Row">
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
                      <div
                        className="edit_Btn"
                        onClick={() => setSelectedItem(item)}
                      >
                        <img src={editBtn} alt="Edit Button" />
                      </div>
                      <div
                        className="delete_Btn"
                        onClick={() => deleteItem(item._id)}
                      >
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

      {/* Modal */}
      {selectedItem && (
        <EditItem
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onUpdate={(updatedItem) => {
            setWarehouseData((prev) =>
              prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
            );
            setFilteredData((prev) =>
              prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
            );
          }}
        />
      )}
    </>
  );
}
