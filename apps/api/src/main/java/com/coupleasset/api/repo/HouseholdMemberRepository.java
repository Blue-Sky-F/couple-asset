package com.coupleasset.api.repo;

import com.coupleasset.api.entity.HouseholdMemberEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseholdMemberRepository extends JpaRepository<HouseholdMemberEntity, Long> {
  Optional<HouseholdMemberEntity> findFirstByUserId(Long userId);

  List<HouseholdMemberEntity> findByHouseholdId(Long householdId);
}

