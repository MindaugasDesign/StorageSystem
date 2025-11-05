export function ItemIDEAS() {
  return (
    <>
      <h1>
        Goal: to store data about received items and when they were received
      </h1>
      <p>
        See movement of certain items (when they were received when they were
        given to production)
      </p>
      <p>
        When item is received it will get a barcode "EK-214525", this will be
        stored in the data as an item received
      </p>
      <p>
        When item "EK-214525" is given to production the state in the DB for
        this shipment and for this parcel will be updated to "Given to
        production on (That days date)"
      </p>
      <p>
        and when checking certain shipments it will show if it's in the
        warehouse (checking barcodes in the WH DB) or it has already been given
        to production
      </p>

      <h3> Test item</h3>

      <div className="itemLoc">
        <ul className="listux">
          {detailsLog.map((item, index) => (
            <li className="listis">
              <ItemView item={item} key={index} />
            </li>
          ))}
        </ul>
      </div>

      <h4>Brainstorm</h4>
      <p>
        If the item get's a new barcode with the one that is already stored in
        the ItemLog. Does it have to have rivile specific barcodes, to have a
        bit more leverage.
      </p>
      <p>A new barcode format : "Rivile-******"?</p>
      <p>
        But barcode is shipment specific. It will have to check if a certain
        shipment has that specific barcode, it that barcode exists but under
        another shipment that is a completely different item
      </p>
    </>
  );
}

function ItemView({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="itemDetailed">
      <div className="headerInfo">
        <p className="item__Name">{item.itemRivile}</p>
        <p className="item__Info">{item.itemInfo}</p>
        <p className="item__Date">{item.itemDate}</p>
        <p className="item__Amount">{item.itemAmount}</p>
        <img
          src={open ? upBtn : downBtn}
          alt="Details button"
          onClick={() => setOpen(!open)}
        />
      </div>

      {open && (
        <div className="details_Visable">
          {item.itemBoxes.map((box, i) => (
            <div className="boxDetails" key={i}>
              <p className="box__Barcode">{box.boxBarcode}</p>
              <p className="box__Vacancy">{box.boxVacancy}</p>
              <p className="box__Amount">{box.boxAmount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
