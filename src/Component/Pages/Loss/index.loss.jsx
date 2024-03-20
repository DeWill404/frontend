import { Box } from "@mui/material";
import { ROUTE } from "../../../Helper/contant";
import { PageHeader, PageTable } from "../../Misc/Page-Misc";
import { useEffect, useRef, useState } from "react";
import LossFilter from "./filter.loss";
import {
  DEFAULT_LOSS_FILTER,
  LOSS_COLUMNS,
} from "../../../assets/data/loss-data";
import { getLossData } from "../../../Service/order.service";
import MonthlyLoss from "./monthly-loss";
import { calculateTotalDust } from "./helper.loss";

const sx = {
  root: {
    "& td:not(:first-of-type), & th:not(:first-of-type)": {
      borderLeft: (theme) => `1px solid ${theme.palette.grey[300]}`,
    },
  },
};

export default function Loss() {
  const route = ROUTE.Loss;

  const [lossData, setLossData] = useState(null);

  const [searchedValue, setSearchedValue] = useState("");
  const [dataList, setDataList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const filterRef = useRef({ ...DEFAULT_LOSS_FILTER });
  const [noDataMessage, setMessage] = useState("No Data to display");
  const totalDust = useRef(0);
  const [reloadTable, setReloadTable] = useState(0);
  const reload = () => setReloadTable((p) => (p === 100 ? 0 : p + 1));
  useEffect(() => {
    (async () => {
      if (!isLoading) {
        setLoading(true);
        let _d = [];
        if (
          filterRef.current.dept &&
          filterRef.current.month &&
          filterRef.current.kt
        ) {
          setMessage("No Data to display");
          const dept = filterRef.current.dept;
          const month = filterRef.current.month;
          const kt = filterRef.current.kt;
          const res = await getLossData(
            searchedValue,
            `&dept=${dept}&month=${month}&kt=${kt}`
          );
          _d = res.data;
        } else {
          setMessage("Select Department & Month to show orders");
        }
        setDataList(_d);
        totalDust.current = calculateTotalDust(_d);
        setLoading(false);
      }
    })();
  }, [reloadTable, searchedValue]);

  return (
    <Box sx={sx.root}>
      <PageHeader
        icon={route.icon}
        label={route.label}
        name={route.name}
        onSearch={setSearchedValue}
        placeholder="Order ID or Customer Name"
        showCreateBtn={false}
      />

      <LossFilter valueRef={filterRef} reload={reload} />

      <PageTable
        isLoading={isLoading}
        headCells={LOSS_COLUMNS}
        rows={dataList}
        noDataMessage={noDataMessage}
      />

      {!isLoading && !!dataList.length && (
        <MonthlyLoss
          filterData={filterRef.current}
          lossData={lossData}
          setLossData={setLossData}
          totalDust={totalDust.current}
        />
      )}
    </Box>
  );
}
