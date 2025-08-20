const generatePDFLabelsSmall = async () => {
  if (itemList.length === 0) return;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [283.5, 595.35], // [10cm, 21cm] in points
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 595.35 pt
  const pageHeight = pdf.internal.pageSize.getHeight(); // 283.5 pt

  for (let i = 0; i < itemList.length; i++) {
    const elementId = `label-${i}`;
    const element = document.getElementById(elementId);
    if (!element) continue;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);

    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;

    const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;

    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);

    if (i < itemList.length - 1) {
      pdf.addPage();
    }
  }

  pdf.save("ReceivedLabels.pdf");
};
