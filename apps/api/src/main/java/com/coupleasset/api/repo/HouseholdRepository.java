package com.coupleasset.api.repo;

import com.coupleasset.api.entity.HouseholdEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdRepository extends JpaRepository<HouseholdEntity, Long> {
  Optional<HouseholdEntity> findFirstByName(String name);
}
