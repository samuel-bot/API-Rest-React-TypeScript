export type UserDTO = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
};

export type UserUpdateDTO = {
  nome: string;
  cpf: string;
  email: string;
};

export type UserCreateDTO = {
  nome: string;
  cpf: string;
  email: string;
};
