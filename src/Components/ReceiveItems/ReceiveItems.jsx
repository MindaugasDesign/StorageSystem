import { useEffect, useState } from "react";
import "./ReceiveItems.css";
import cancelBtn from "/src/assets/close-square-svgrepo-com.svg";
import acceptBtn from "/src/assets/check-square-svgrepo-com.svg";
import addItem from "/src/assets/add-square-svgrepo-com.svg";
import { ItemModal } from "../ReceiveItemModal/ItemModal";
import Barcode from "react-barcode";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

export function ReceiveItems() {
  const navigate = useNavigate();
  const [whData, setWarehouseData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [userRole, setUserRole] = useState(localStorage.getItem("Power"));
  const BACKEND = `http://${window.location.hostname}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;

  useEffect(() => {
    fetch(`${BACKEND}/items`)
      .then((res) => res.json())
      .then((data) => {
        setWarehouseData(data);
      });
  }, []);
  //update
  useEffect(() => {
    if (whData.length > 0) {
      const useris = localStorage.getItem("LoggedUser");
      const loggedInUser = whData.filter((user) => user.stockkeeper === useris);
      setUserData(loggedInUser);
    }
  }, [whData]);

  const generatePDFLabels = async () => {
    if (itemList.length === 0) return;

    // Separate items by paper size
    const a4Items = itemList.filter((item) => item.paperSize === "A4");
    const labelItems = itemList.filter((item) => item.paperSize === "label");

    // Helper function to create PDF for a list of items
    const createPDF = async (
      items,
      pdfName,
      format,
      orientation = "portrait"
    ) => {
      if (items.length === 0) return;

      const pdf = new jsPDF({ orientation, unit: "pt", format });

      for (let i = 0; i < items.length; i++) {
        const element = document.getElementById(
          `label-${itemList.indexOf(items[i])}`
        );
        if (!element) continue;

        const canvas = await html2canvas(element, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const scale = Math.min(
          pageWidth / imgProps.width,
          pageHeight / imgProps.height
        );
        const scaledWidth = imgProps.width * scale;
        const scaledHeight = imgProps.height * scale;
        const x = (pageWidth - scaledWidth) / 2;
        const y = 0;

        pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

        if (i < items.length - 1) pdf.addPage();
      }

      pdf.save(pdfName);
    };

    // Create PDFs
    await createPDF(a4Items, `ReceivedLabelsA4.pdf`, "a4", "portrait");
    await createPDF(
      labelItems,
      "ReceivedLabelsSmall.pdf",
      [283.5, 595.35],
      "landscape"
    );
  };

  const submitItem = (itemDataArray) => {
    const modal = document.getElementById("itemModal");
    setItemList((prev) => [...prev, ...itemDataArray]);
    modal.style.display = "none";
  };

  const handleAcceptClick = async () => {
    if (itemList.length === 0) {
      alert("❗ No items to submit.");
      return;
    }

    try {
      // 1️⃣ Send items to warehouse
      const res = await fetch("http://192.168.116.65:7750/addPackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemList),
      });

      if (!res.ok) throw new Error("Failed to submit packages.");
      const data = await res.json();
      console.log("✅ Warehouse updated:", data);

      // 2️⃣ Log "received" items
      const logRes = await fetch("http://192.168.116.65:7750/logPackages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          itemList.map((pkg) => ({
            barcode: pkg.barcode,
            rivile: pkg.rivile,
            shippingRemarks: pkg.shippingRemarks,
            quantity: pkg.quantity,
            receivedBy: pkg.receivedBy,
            DoA: pkg.DoA,
            status: "Available",
          }))
        ),
      });

      if (!logRes.ok) throw new Error("Failed to create logs.");
      console.log("🧾 Log entries added successfully.");

      // 3️⃣ Generate PDF
      setTimeout(async () => {
        await generatePDFLabels();
        setItemList([]);
      }, 100);
    } catch (err) {
      console.error("❌ Error submitting items:", err);
      alert("Failed to submit packages.");
    }
  };

  const cancelReceive = () => {
    if (userRole) {
      navigate("/main");
    } else {
      navigate("/");
    }
  };

  const modalUse = () => {
    const modal = document.getElementById("itemModal");
    const btn = document.getElementById("modalControl");
    const span = document.getElementsByClassName("close")[0];
    btn.onclick = function () {
      modal.style.display = "block";
    };
    span.onclick = function () {
      modal.style.display = "none";
    };
  };

  return (
    <>
      <div className="receiveItems_Title">
        <h1 className="receiveItems_Header1">Receive Items</h1>

        <div className="controlBtns_Receive">
          <img
            src={acceptBtn}
            alt="Submit"
            style={{ cursor: "pointer" }}
            onClick={async () => {
              handleAcceptClick();
            }}
          />

          <img src={cancelBtn} alt="" onClick={cancelReceive} />
        </div>
      </div>

      <div>
        <div>
          <div
            id="modalControl"
            className="controlBtns_AddItem"
            onClick={() => {
              modalUse();
            }}
          >
            <img src={addItem} alt="" />
          </div>
          <div className="dataContainer">
            <div id="labelPrintArea">
              {itemList.map((item, index) => (
                <div key={index} id={`label-${index}`}>
                  <DataBlock props={item} whData={whData} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <ItemModal userData={userData} submitItem={submitItem} />
      </div>
    </>
  );
}

function DataBlock({ props, whData }) {
  const correctItem = whData.find((item) => item.rivile === props.rivile);
  return (
    <div className="allitems">
      <div className="barcodeLoc">
        <Barcode
          value={props.barcode}
          width={2.3}
          height={30}
          fontSize={13}
          displayValue={true}
          background="#FFFFFF"
          lineColor="#000"
        />
      </div>
      <h2 className="item-rivile">{props.rivile}</h2>
      <p className="item-name">{correctItem.name}</p>
      <p className="item-remarks">{props.shippingRemarks}</p>
      <p className="item-doa">{props.DoA}</p>
      <p className="item-quantity">
        {props.quantity} {correctItem.UoM}
      </p>
    </div>
  );
}
