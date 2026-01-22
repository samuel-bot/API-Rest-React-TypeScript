/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserDTO, UserUpdateDTO } from "../../models/user";
import axios from "axios";
import { findById, updateUser } from "../../services/user-service";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";

type FormData = {
  nome: string;
  cpf: string;
  email: string;
};

export default function UserEditBase() {
  const navigate = useNavigate();

  const { userId } = useParams();

  const [user, setUser] = useState<UserDTO>();

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
  });

  useEffect(() => {
    async function fetchUserData() {
      if (userId) {
        try {
          const data : UserDTO = await findById(Number(userId));
          setUser(data);
          setFormData({
            nome: data.nome,
            cpf: data.cpf,
            email: data.email,
          });
        } catch (error: unknown) {
          let msg = "Erro ao carregar Usuário!";
          if (axios.isAxiosError(error) && error.response) {
            msg = error.response.data.error || msg;
          }
          setError(msg);
          setTimeout(() => setError(null), 4000);
          navigate("/");
        }
      }
    }
    fetchUserData();
  }, [userId, navigate]);

  function handleFormChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Impede o recarregamento da página
    try {
      const requestBody = formData as UserUpdateDTO;

      await updateUser(Number(userId), requestBody);
      setSuccess("Usuário atualizado com sucesso!");
      setTimeout(() => navigate("/"), 3000);
    } catch (error: unknown) {
      let msg = "Erro ao salvar Usuário. Tente novamente";
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dados inválidos: ${errorMessages}. Tente novamente.`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  }

  return (
    <Box sx={{ mt: 2, p: 4 }}>
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

      <Typography variant="h4" component="h1">
        Editando Usuário ID : {user?.id} : {formData.nome}
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{ mt: 2 }}
        onSubmit={handleSubmit} //chama a função
      >
        <TextField
          id="nome"
          name="nome"
          label="Nome do Usuário"
          value={formData.nome}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          autoFocus
          sx={{ mb: 2 }}
        />
        <TextField
          id="cpf"
          name="cpf"
          label="CPF do Usuário"
          value={formData.cpf}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="email"
          name="email"
          label="E-mail do Usuário"
          value={formData.email}
          onChange={handleFormChange}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
          >
            Cancelar
          </Button>
          <Button variant="outlined" color="primary" type="submit">
            Salvar
          </Button>
        </Box>
      </Box>
    </Box>
  );
}