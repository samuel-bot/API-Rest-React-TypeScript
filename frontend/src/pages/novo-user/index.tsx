/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserCreateDTO } from "../../models/user";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { createUser } from "../../services/user-service";
import axios from "axios";

export default function NovoUsuario() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserCreateDTO>({
    nome: "",
    cpf: "",
    email: "",
  });

  type FormErrors = {
  nome: string | null;
  cpf: string | null;
  email: string | null;
};

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formErrors, setFormErros] = useState<FormErrors>({
    nome: null,
    cpf: null,
    email: null,
  })

  const validarNome = (nome: string): string | null => {
  if (!nome.trim()) return "Nome é obrigatório";
  if (nome.trim().length < 3) return "Nome deve ter pelo menos 3 caracteres";
  return null;
};

const validarCPF = (cpf: string): string | null => {
  if (!cpf.trim()) return "CPF é obrigatório";

  const cpfLimpo = cpf.replace(/\D/g, "");
  if (cpfLimpo.length !== 11) return "CPF deve ter 11 dígitos";

  return null;
};

const validarEmail = (email: string): string | null => {
  if (!email.trim()) return "E-mail é obrigatório";

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) return "E-mail inválido";

  return null;
};

const validarFormulario = (): boolean => {
  const erros: FormErrors = {
    nome: validarNome(formData.nome),
    cpf: validarCPF(formData.cpf),
    email: validarEmail(formData.email),
  };

  setFormErros(erros);

  // retorna true se NÃO houver erros
  return !Object.values(erros).some((erro) => erro !== null);
};



  // arrow functions
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if(!validarFormulario()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await createUser(formData);
      setSuccess("Usuário criado com sucesso!");
      // Limpa o formulário após o sucesso
      setFormData({
        nome: "",
        cpf: "",
        email: "",
      });
      setTimeout(() => navigate("/"), 4000);
    } catch (error: unknown) {
      let msg = "Erro ao criar usuário! Tente novamente";
      if (axios.isAxiosError(error) && error.response && error.response.data) {
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const errorMessages = error.response.data.errors
            .map((e: any) => e.message)
            .join(", ");
          msg = `Dados inválidos: ${errorMessages}. Tente novamente`;
        } else {
          msg = error.response.data.error || msg;
        }
      }
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsLoading(false);
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

      <Typography>Cadastro de Usuário</Typography>

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
          onChange={handleChange}
          error={!!formErrors.nome}
          helperText={formErrors.nome}
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
          onChange={handleChange}
          error={!!formErrors.cpf}
          helperText={formErrors.cpf}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          id="email"
          name="email"
          label="E-mail do Usuário"
          value={formData.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
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
          <Button variant="outlined" color="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
                <CircularProgress size={24} color="inherit" />
            ) : (
                "Salvar"
            )}
           
          </Button>
        </Box>
      </Box>
    </Box>
  );
}