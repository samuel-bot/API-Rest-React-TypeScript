/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { UserDTO } from "../../models/user";

import * as userService from "../../services/user-service";
import axios from "axios";
import { Link } from "react-router-dom";
import { Delete, Edit } from "@mui/icons-material";

export default function ListarUsers() {
   const [users, setUsers] = useState<UserDTO[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.findAll();
        setUsers(data);
      } catch (error: unknown) {
        let msg = "Erro ao carregar Usuários!";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = async (id: number) => {
    if (window.confirm(`Tem certeza que deseja excluir o Usuário ID: ${id}?`))
      try {
        await userService.deleteById(id);
        setUsers(users.filter((user) => user.id !== id));
        setSuccess("Usuário excluído com sucesso!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (error: unknown) {
        let msg = "Erro a excluir Usuário";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setSuccess(null);
        setError(msg);
        setTimeout(() => setError(null), 4000);
      }
  };
  return (
    <Box sx={{ p: 4 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Usuários
        </Typography>

        <Button variant="contained">
          <Link
            to="/users/novo"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Novo
          </Link>
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        !error && (
          <TableContainer component={Paper}>
            <Table sx={{ minWi: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="editar"
                        component={Link}
                        to={`/users/editar/${user.id}`}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        aria-label="excluir"
                        onClick={() => handleChange(user.id)}
                        sx={{ ml: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Box>
  );
}