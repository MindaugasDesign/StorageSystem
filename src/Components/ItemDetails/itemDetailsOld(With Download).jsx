// ItemDetails.jsx
import { useLocation, useNavigate } from "react-router-dom";
import "./ItemDetails.css";
import Barcode from "react-barcode";
import downloadBtn from "/src/assets/download-svgrepo-com.svg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import detailsLogo from "/src/assets/clipboard-svgrepo-com.svg";

export function ItemDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, itemName, itemUnit, itemRivile } = location.state || {};

  const detailBtn = () => {
    navigate("/item_log", {
      state: { itemRivile: itemRivile },
    });
  };

  return (
    <>
      <div className="itemDetailsHeader">
        <h2 id="open_Item">{itemName}</h2>
        <div className="detailLogo" onClick={detailBtn}>
          <img src={detailsLogo} alt="" />
          <p>Details</p>
        </div>
        {/* <button>Details</button> */}
      </div>
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
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

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
    pdf.save(`${itemName}_${details.barcode}.pdf`);
  };

  return (
    <div className="itemContainer">
      <div className="textWrapper" ref={textWrapperRef}>
        <div className="barcodeLoc">
          <Barcode
            value={details.barcode}
            width={2.6}
            height={30}
            fontSize={13}
            displayValue={true}
            background="#FFFFFF"
            lineColor="#000"
          />
        </div>
        <h2 className="item-rivile">{itemRivile}</h2>
        <p className="item-name">{itemName}</p>
        <p className="item-remarks">{details.shippingRemarks}</p>
        <p className="item-doa">{details.DoA}</p>
        <p className="item-quantity">{`${details.quantity} ${itemUnit}`}</p>
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
