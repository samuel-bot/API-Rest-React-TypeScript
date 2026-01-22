import axios from "axios";
import type { UserCreateDTO, UserDTO, UserUpdateDTO } from "../models/user";
import { BASE_URL } from "../utils/system";

export async function findAll(): Promise<UserDTO[]> {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
}

export async function deleteById(id: number) {
  await axios.delete(`${BASE_URL}/users/${id}`);
}

export async function findById(id: number): Promise<UserDTO> {
  const response = await axios.get(`${BASE_URL}/users/${id}`);

  return response.data;
}

export async function updateUser(
  userId: number,
  requestBody: UserUpdateDTO
): Promise<UserDTO> {
  const response = await axios.put(`${BASE_URL}/users/${userId}`, requestBody);
  return response.data;
}

export async function createUser(dto: UserCreateDTO): Promise<UserDTO> {
  const response = await axios.post(`${BASE_URL}/users`, dto);

  return response.data;
}