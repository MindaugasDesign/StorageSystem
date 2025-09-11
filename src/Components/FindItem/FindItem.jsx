<<<<<<< HEAD
import { useState, useEffect } from "react";
import "./FindItem.css";

export function FindItem({ data, onFilter }) {
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [emptyOnly, setEmptyOnly] = useState(false);

  useEffect(() => {
    let filtered = data;

    // Search filter
    if (searchText) {
      filtered = filtered.filter((item) => {
        if (searchField === "all") {
          return Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchText.toLowerCase())
          );
        } else if (searchField === "shippingRemarks") {
          return item.packages.some((pkg) =>
            pkg.shippingRemarks
              ?.toLowerCase()
              .includes(searchText.toLowerCase())
          );
        } else {
          return String(item[searchField])
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }
      });
    }
    // Calculate stock from packages
    filtered = filtered.map((item) => ({
      ...item,
      stock: item.packages.length,
    }));

    // Low stock filter
    if (lowStockOnly) {
      filtered = filtered.filter((item) => 1 < item.stock && item.stock <= 3); // or use item.lowStockThreshold
    }

    // Empty stock filter
    if (emptyOnly) {
      filtered = filtered.filter((item) => item.stock === 0);
    }

    onFilter(filtered);
  }, [searchText, searchField, lowStockOnly, emptyOnly, data, onFilter]);

  return (
    <div className="search-box">
      <input
        id="searchInput"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <select
        id="searchField"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        <option value="all">All Fields</option>
        <option value="rivile">Rivilė</option>
        <option value="name">Item Name</option>
        <option value="itemId">ItemID</option>
        <option value="location">Location</option>
        <option value="shippingRemarks">Container</option>
      </select>
      <label>
        <input
          type="checkbox"
          id="lowStockOnly"
          checked={lowStockOnly}
          onChange={(e) => setLowStockOnly(e.target.checked)}
        />
        Low Stock Only
      </label>
      <label>
        <input
          type="checkbox"
          id="emptyOnly"
          checked={emptyOnly}
          onChange={(e) => setEmptyOnly(e.target.checked)}
        />
        Empty Only
      </label>
    </div>
=======
export function FindItem() {
  return (
    <>
      <h1>This is find item</h1>
    </>
>>>>>>> 475407b4d06dd2385649eca88a9170ef57132b6a
  );
}
