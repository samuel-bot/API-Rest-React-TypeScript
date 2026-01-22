package br.com.fiap.api_user.repository;

import br.com.fiap.api_user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
