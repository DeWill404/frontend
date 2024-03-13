import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Skeleton,
} from "@mui/material";
import TableActionMenu from "../../Misc/Page-Misc/table-action-menu";
import { imagePath } from "../../../Helper/misc";

function DesignTableCard({ onRowClick, row, actions }) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: "100%" }}>
        <CardActionArea onClick={() => onRowClick(row._id)}>
          <CardMedia
            component="img"
            height="190"
            image={imagePath(row["final_image"]["url"])}
          />
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <h2>{row["design_id"]}</h2>
              <TableActionMenu
                id={row._id}
                actions={actions}
                buttonProps={{ size: "small" }}
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <span>
                <strong>Metal: </strong>
                {row["metal"].value || "-"}
              </span>
              <span>
                <strong>Rhodium: </strong>
                {row["rhodium"].value || "-"}
              </span>
            </Box>
            <span>
              <strong>KT: </strong>
              {row["kt"].value || "-"}
            </span>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default function DesignTableGrid({
  isLoading,
  rows,
  onRowClick,
  tableActions,
}) {
  return (
    <Box paddingBlock="20px" marginTop={"20px"}>
      <Grid container spacing={3}>
        {isLoading ? (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: "100%" }}>
              <Box height={200} width={1} position="relative">
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="100%"
                  height="100%"
                ></Skeleton>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <CircularProgress color="inherit" size={32} />
                  <span>Loading</span>
                </Box>
              </Box>
            </Card>
          </Grid>
        ) : (
          rows.map((row, idx) => (
            <DesignTableCard
              key={idx}
              row={row}
              onRowClick={onRowClick}
              actions={tableActions}
            />
          ))
        )}
      </Grid>
    </Box>
  );
}
