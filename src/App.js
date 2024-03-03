import { Box } from "@mui/material";
import { Header } from "./Component/Header/index.header";
import { Main } from "./Component/Main/index.main";
import useAuth from "./Hook/useAuth";
import useMessage from "./Hook/useMessage";

function App() {
  useMessage();
  useAuth();

  return (
    <Box display="flex" flexDirection="column" width={1} height={1}>
      <div id="scroll-to-top"></div>
      <Header />
      <Main />
    </Box>
  );
}

export default App;
