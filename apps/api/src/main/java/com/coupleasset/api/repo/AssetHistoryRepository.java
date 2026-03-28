package com.coupleasset.api.repo;

import com.coupleasset.api.entity.AssetHistoryEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssetHistoryRepository extends JpaRepository<AssetHistoryEntity, Long> {
  List<AssetHistoryEntity> findByHouseholdIdOrderByRecordMonthAsc(Long householdId);
  Optional<AssetHistoryEntity> findByHouseholdIdAndRecordMonth(Long householdId, String recordMonth);
}
