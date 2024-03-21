import { useDispatch, useSelector } from "react-redux";
import PDFDocument from "./index.pdf";
import { usePDF } from "@react-pdf/renderer";
import { useEffect } from "react";
import { toggleExportPDF, togglePageLoader } from "../../Store/misc.slice";
import { saveAs } from "file-saver";

export default function PDFExport() {
  const { exportPDF } = useSelector((store) => store.misc);
  const dispatch = useDispatch();

  const [instance, _] = usePDF({
    document: <PDFDocument data={exportPDF.data} />,
  });

  useEffect(() => {
    if (!instance.loading) {
      const fileName = exportPDF.data.order_id
        ? `${exportPDF.data.order_id}.pdf`
        : "New Order.pdf";
      saveAs(instance.blob, fileName);
      dispatch(togglePageLoader(false));
      dispatch(toggleExportPDF({ visible: false }));
    }
  }, [instance.loading]);

  return <></>;
}
