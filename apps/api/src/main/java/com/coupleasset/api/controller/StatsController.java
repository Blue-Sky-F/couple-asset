package com.coupleasset.api.controller;

import com.coupleasset.api.auth.AuthContext;
import com.coupleasset.api.dto.MonthlyStatsResponse;
import com.coupleasset.api.entity.AssetHistoryEntity;
import com.coupleasset.api.service.AssetHistoryService;
import com.coupleasset.api.service.TransactionService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
  private final TransactionService txService;
  private final AssetHistoryService historyService;

  public StatsController(TransactionService txService, AssetHistoryService historyService) {
    this.txService = txService;
    this.historyService = historyService;
  }

  @GetMapping("/monthly")
  public MonthlyStatsResponse monthly(@RequestParam("month") String month) {
    long userId = AuthContext.requireUserId();
    return txService.monthlyStats(userId, month);
  }

  @GetMapping("/asset-history")
  public List<AssetHistoryEntity> assetHistory() {
    long userId = AuthContext.requireUserId();
    return historyService.getHistory(userId);
  }
}

