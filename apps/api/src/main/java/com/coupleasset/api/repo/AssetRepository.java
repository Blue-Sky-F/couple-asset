package com.coupleasset.api.repo;

import com.coupleasset.api.entity.AssetEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetRepository extends JpaRepository<AssetEntity, Long> {
  List<AssetEntity> findByHouseholdId(Long householdId);
}

