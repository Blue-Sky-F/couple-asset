package com.coupleasset.api.repo;

import com.coupleasset.api.entity.TransactionEntity;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {
  List<TransactionEntity> findByHouseholdIdAndOccurredAtBetween(
      Long householdId, LocalDateTime startInclusive, LocalDateTime endExclusive);
}

