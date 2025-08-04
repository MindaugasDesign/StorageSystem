// ItemDetails.jsx
import { useLocation } from "react-router-dom";
import "./ItemDetails.css";
import Barcode from "react-barcode";
import downloadBtn from "/src/assets/download-svgrepo-com.svg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

export function ItemDetails() {
  const location = useLocation();
  const { data, itemName, itemUnit, itemRivile } = location.state || {};

  return (
    <>
      <h2 id="open_Item">{itemName}</h2>
      <div id="list_Container">
        {data.map((singleItem) => (
          <SingleItem
            key={singleItem.barcode}
            details={singleItem}
            itemName={itemName}
            itemUnit={itemUnit}
            itemRivile={itemRivile}
          />
        ))}
      </div>
    </>
  );
}

function SingleItem({ details, itemName, itemUnit, itemRivile }) {
  const textWrapperRef = useRef(null);

  const handleDownloadPDF = async () => {
    const element = textWrapperRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff", // or null for transparent
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 30, 20, pdfWidth, pdfHeight);
    pdf.save(`${itemName}_${details.barcode}.pdf`);
  };

  return (
    <div className="itemContainer">
      <div className="textWrapper" ref={textWrapperRef}>
        <div className="barcodeLoc">
          <Barcode
            value={details.barcode}
            width={2.3}
            height={50}
            fontSize={16}
            displayValue={true}
            background="#FFFFFF"
            lineColor="#000"
          />
        </div>
        <p className="itemRemarks">{details.shippingRemarks}</p>
        <p className="itemRivile">{itemRivile}</p>
        <p className="itemName">{itemName}</p>
        <p className="itemQuantity">{`${details.quantity} ${itemUnit}`}</p>
        <p className="itemDoA">{details.DoA}</p>
      </div>

      <div
        className="download_Btn"
        onClick={handleDownloadPDF}
        style={{ cursor: "pointer" }}
      >
        <img src={downloadBtn} alt="Download Button" />
      </div>
    </div>
  );
}
