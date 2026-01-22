import { Box } from "@mui/material";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter,Navigate, Route, Routes } from "react-router-dom";
import ListarUsers from "./pages/listar-users";
import UserEditBase from "./pages/user-edit-base";
import NovoUsuario from "./pages/novo-user";

export default function App() {
  

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header title="Admin Usuários" />

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ListarUsers />} />
            <Route path="/users/novo" element={<NovoUsuario />} />
            {/* <Route path="/users/editar/:userId" element={<EditarUser />} /> */}
            <Route path="/users/editar/:userId" element={<UserEditBase />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </Box>

      <Footer />
    </Box>
  );
}

 
