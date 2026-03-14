package com.coupleasset.api.repo;

import com.coupleasset.api.entity.UserEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
  Optional<UserEntity> findByEmailIgnoreCase(String email);

  Optional<UserEntity> findByPhone(String phone);
}

