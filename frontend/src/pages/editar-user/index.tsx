import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserDTO, UserUpdateDTO } from "../../models/user";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { findById, updateUser } from "../../services/user-service";
import axios from "axios";

type FormData = {
  nome: string;
  cpf: string;
  email: string;
};

export default function EditarUser() {
  const navigate = useNavigate();

  const { userId } = useParams<{ userId: string }>();

  const [user, setUser] = useState<UserDTO>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
  });

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    async function fetchUserData() {
      if (!userId) {
        setIsLoading(false);
        setError("Nenhum ID de Usuário fornecido para edição");
        return;
      }
      try {
        const data = await findById(Number(userId));
        setUser(data);
        setFormData({
          nome: data.nome,
          cpf: data.cpf,
          email: data.email,
        });
      } catch (error: unknown) {
        let msg = "Erro ao carregar Usuário";
        if (axios.isAxiosError(error) && error.response) {
          msg = error.response.data.error || msg;
        }
        setError(msg);
        setTimeout(() => setError(null), 4000);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, [userId, navigate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //   function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  //     const { name, value } = event.target;
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }

  //   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  //     event.preventDefault();
  //     setError(null);
  //     setSuccess(null);
  //     setIsSubmitting(true)
  //     try {
  //       const dataToSend = { ...formData };
  //       const updateUserDTO: UserUpdateDTO = {
  //         nome: dataToSend.nome,
  //         cpf: dataToSend.cpf,
  //         email: dataToSend.email,
  //       };
  //       await updateUser(Number(userId), updateUserDTO);
  //       setSuccess("Usuário atualizado com sucesso!");
  //       setTimeout(() => {
  //         navigate("/");
  //       }, 3000);
  //     } catch (error: unknown) {
  //       let msg = "Erro ao salvar Usuário. Tente novamente";
  //       if (axios.isAxiosError(error) && error.response && error.response.data) {
  //         if (
  //           error.response.data.errors &&
  //           Array.isArray(error.response.data.errors)
  //         ) {
  //           const errorMessages = error.response.data.errors
  //             .map((e: any) => e.message)
  //             .join(", ");
  //           msg = `Dados inválidos: ${errorMessages}. Tente novamente.`;
  //         } else {
  //           msg = error.response.data.error || msg;
  //         }
  //       }
  //       setError(msg);
  //       setTimeout(() => setError(null), 4000);
  //     } finally {
  //       setIsSubmitting(false);
  //     }
  //   }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      // Faz o casting direto para o DTO (refatoração anterior mantida)
      const requestBody = formData as UserUpdateDTO;

      await updateUser(Number(userId), requestBody);
      setSuccess("Usuário atualizado com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
    } finally {
      setIsSubmitting(false);
    }
  };

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
        Editar Usuário
      </Typography>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        !error && (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome do Usuário"
              name="nome"
              autoFocus
              value={formData.nome}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="cpf"
              label="CPF do Usuário"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail do Usuário"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Salvar"}
              </Button>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
}