export function GiveToProduction() {
  return (
    <>
      <h1>This is to give to production</h1>

      <div className="detaless">
        <h2>Must</h2>
        <p>
          this will have a input field where the user scans the barcode
          "EK-455421"
        </p>
        <p>
          there has to be a check for each user - only the user that has that
          item can scan it out, unless an admin or a superuser(vadovas)
        </p>
        <p>idea view is the test.html file in the folder.</p>
        <h2>optional</h2>
        <p>
          have a field below to store daily data for what has been scanned out?
        </p>
        <p>
          do i need a confirmation screen with all of the data from the barcode?
        </p>
        <p>
          The page will be very bland and empty if it's just a input and some
          text below
        </p>
        <p>
          das add a summary of how many boxes and how many unique items were
          scanned out on that day
        </p>
      </div>
    </>
  );
}
