package br.com.fiap.api_user.dto;

import br.com.fiap.api_user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserDTO {

    private Long id;
    @NotBlank(message = "O nome não pode ser vazio, nulo ou em branco")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String nome;
    @NotBlank(message = "CPF: campo requerido")
    private String cpf;
    @NotBlank(message = "E-mail: campo requerido")
    private String email;



    public UserDTO(User entity) {
        id = entity.getId();
        nome = entity.getNome();
        cpf = entity.getCpf();
        email = entity.getEmail();

    }
}
