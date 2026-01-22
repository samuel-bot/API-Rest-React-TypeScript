package br.com.fiap.api_user.service;

import br.com.fiap.api_user.dto.UserDTO;
import br.com.fiap.api_user.entity.User;
import br.com.fiap.api_user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    @Transactional(readOnly = true)
    public List<UserDTO> findAll(){
        return repository.findAll()
                .stream().map(UserDTO::new).toList();
    }

    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        User entity = repository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Recurso não encontrado. ID " + id)
        );
        return new UserDTO(entity);
    }

    @Transactional
    public UserDTO insert(UserDTO dto) {
        User entity = new User();

        toEntity(dto, entity);
        entity = repository.save(entity);
        return new UserDTO(entity);
    }

    private void toEntity(UserDTO dto, User entity) {
        entity.setNome(dto.getNome());
        entity.setEmail(dto.getEmail());
        entity.setCpf(dto.getCpf());
    }
    @Transactional
    public UserDTO update(Long id, UserDTO dto) {
        try{
            User entity = repository.getReferenceById(id);
            toEntity(dto,entity);
            entity = repository.save(entity);
            return new UserDTO(entity);
        }catch (EntityNotFoundException ex) {
            throw new EntityNotFoundException("Recurso não encontrado. Id: " + id);
        }
    }
    @Transactional
    public void delete(Long id) {
        if(!repository.existsById(id)) {
            throw new EntityNotFoundException("Recurso não encontrado. Id: " + id);
        }
        repository.deleteById(id);
    }

}
