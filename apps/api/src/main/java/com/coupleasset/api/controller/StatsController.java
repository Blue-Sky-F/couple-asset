package com.coupleasset.api.controller;

import com.coupleasset.api.auth.AuthContext;
import com.coupleasset.api.dto.MonthlyStatsResponse;
import com.coupleasset.api.service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatsController {
  private final TransactionService txService;

  public StatsController(TransactionService txService) {
    this.txService = txService;
  }

  @GetMapping("/monthly")
  public MonthlyStatsResponse monthly(@RequestParam("month") String month) {
    long userId = AuthContext.requireUserId();
    return txService.monthlyStats(userId, month);
  }
}

