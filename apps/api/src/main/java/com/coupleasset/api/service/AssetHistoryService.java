package com.coupleasset.api.service;

import com.coupleasset.api.entity.AssetEntity;
import com.coupleasset.api.entity.AssetHistoryEntity;
import com.coupleasset.api.repo.AssetHistoryRepository;
import com.coupleasset.api.repo.AssetRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssetHistoryService {
  private final AssetHistoryRepository historyRepo;
  private final AssetRepository assetRepo;
  private final HouseholdService householdService;

  public AssetHistoryService(
      AssetHistoryRepository historyRepo,
      AssetRepository assetRepo,
      HouseholdService householdService) {
    this.historyRepo = historyRepo;
    this.assetRepo = assetRepo;
    this.householdService = householdService;
  }

  public List<AssetHistoryEntity> getHistory(long userId) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    List<AssetHistoryEntity> list = new ArrayList<>(historyRepo.findByHouseholdIdOrderByRecordMonthAsc(householdId));
    String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));

    boolean hasCurrent = list.stream().anyMatch(h -> h.getRecordMonth().equals(currentMonth));
    if (!hasCurrent) {
      // Create a transient entity for display
      List<AssetEntity> assets = assetRepo.findByHouseholdId(householdId);
      BigDecimal totalAmount = assets.stream()
          .map(AssetEntity::getAmount)
          .reduce(BigDecimal.ZERO, BigDecimal::add);

      AssetHistoryEntity current = new AssetHistoryEntity();
      current.setHouseholdId(householdId);
      current.setRecordMonth(currentMonth);
      current.setTotalAmount(totalAmount);
      list.add(current);
    }
    return list;
  }

  @Transactional
  public void syncCurrentMonthHistory(long householdId) {
    String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM"));
    List<AssetEntity> assets = assetRepo.findByHouseholdId(householdId);
    BigDecimal totalAmount = assets.stream()
        .map(AssetEntity::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    AssetHistoryEntity history = historyRepo.findByHouseholdIdAndRecordMonth(householdId, currentMonth)
        .orElseGet(() -> {
          AssetHistoryEntity h = new AssetHistoryEntity();
          h.setHouseholdId(householdId);
          h.setRecordMonth(currentMonth);
          return h;
        });

    history.setTotalAmount(totalAmount);
    historyRepo.save(history);
  }
}
