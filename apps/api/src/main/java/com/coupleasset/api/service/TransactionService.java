package com.coupleasset.api.service;

import com.coupleasset.api.dto.CreateTransactionRequest;
import com.coupleasset.api.dto.MonthlyStatsResponse;
import com.coupleasset.api.dto.TransactionDto;
import com.coupleasset.api.dto.UpdateTransactionRequest;
import com.coupleasset.api.entity.Scope;
import com.coupleasset.api.entity.TransactionDirection;
import com.coupleasset.api.entity.TransactionEntity;
import com.coupleasset.api.error.ApiException;
import com.coupleasset.api.repo.HouseholdMemberRepository;
import com.coupleasset.api.repo.TransactionRepository;
import com.coupleasset.api.util.MonthUtil;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {
  private final TransactionRepository txRepo;
  private final HouseholdService householdService;
  private final HouseholdMemberRepository memberRepo;

  public TransactionService(
      TransactionRepository txRepo, HouseholdService householdService, HouseholdMemberRepository memberRepo) {
    this.txRepo = txRepo;
    this.householdService = householdService;
    this.memberRepo = memberRepo;
  }

  public List<TransactionDto> list(long userId, String month, String scope, Long ownerUserId) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    MonthUtil.Range range = MonthUtil.rangeForMonth(month);
    List<TransactionEntity> all =
        txRepo.findByHouseholdIdAndOccurredAtBetween(householdId, range.startInclusive(), range.endExclusive());
    return all.stream()
        .filter(t -> scope == null || t.getScope().name().equalsIgnoreCase(scope))
        .filter(t -> ownerUserId == null || (t.getOwnerUserId() != null && t.getOwnerUserId().equals(ownerUserId)))
        .map(TransactionService::toDto)
        .toList();
  }

  @Transactional
  public TransactionDto create(long userId, CreateTransactionRequest req) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    TransactionEntity t = new TransactionEntity();
    t.setHouseholdId(householdId);
    apply(
        t,
        householdId,
        req.getScope(),
        req.getOwnerUserId(),
        req.getDirection(),
        req.getCategory(),
        req.getAmount(),
        req.getOccurredAt(),
        req.getNote());
    return toDto(txRepo.save(t));
  }

  @Transactional
  public TransactionDto update(long userId, long txId, UpdateTransactionRequest req) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    TransactionEntity t = requireOwned(txId, householdId);
    apply(
        t,
        householdId,
        req.getScope(),
        req.getOwnerUserId(),
        req.getDirection(),
        req.getCategory(),
        req.getAmount(),
        req.getOccurredAt(),
        req.getNote());
    return toDto(t);
  }

  @Transactional
  public void delete(long userId, long txId) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    TransactionEntity t = requireOwned(txId, householdId);
    txRepo.delete(t);
  }

  public MonthlyStatsResponse monthlyStats(long userId, String month) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    MonthUtil.Range range = MonthUtil.rangeForMonth(month);
    List<TransactionEntity> all =
        txRepo.findByHouseholdIdAndOccurredAtBetween(householdId, range.startInclusive(), range.endExclusive());

    BigDecimal income = BigDecimal.ZERO;
    BigDecimal expense = BigDecimal.ZERO;
    for (TransactionEntity t : all) {
      if (t.getDirection() == TransactionDirection.INCOME) {
        income = income.add(t.getAmount());
      } else {
        expense = expense.add(t.getAmount());
      }
    }
    return new MonthlyStatsResponse(month, income, expense);
  }

  private TransactionEntity requireOwned(long txId, long householdId) {
    TransactionEntity t =
        txRepo
            .findById(txId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "not found"));
    if (!t.getHouseholdId().equals(householdId)) {
      throw new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "not found");
    }
    return t;
  }

  private void apply(
      TransactionEntity t,
      long householdId,
      String scopeRaw,
      Long ownerUserId,
      String directionRaw,
      String category,
      BigDecimal amount,
      LocalDateTime occurredAt,
      String note) {
    Scope scope = parseScope(scopeRaw);
    TransactionDirection direction = parseDirection(directionRaw);
    if (scope == Scope.PERSONAL) {
      if (ownerUserId == null) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "ownerUserId required");
      }
      ensureMember(householdId, ownerUserId);
      t.setOwnerUserId(ownerUserId);
    } else {
      t.setOwnerUserId(null);
    }
    t.setScope(scope);
    t.setDirection(direction);
    t.setCategory(category.trim());
    t.setAmount(amount);
    t.setOccurredAt(occurredAt);
    t.setNote(note == null ? null : note.trim());
  }

  private void ensureMember(long householdId, long userId) {
    Set<Long> memberIds =
        memberRepo.findByHouseholdId(householdId).stream()
            .map(m -> m.getUserId())
            .collect(Collectors.toSet());
    if (!memberIds.contains(userId)) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "invalid ownerUserId");
    }
  }

  private static Scope parseScope(String raw) {
    try {
      return Scope.valueOf(raw.trim().toUpperCase());
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "invalid scope");
    }
  }

  private static TransactionDirection parseDirection(String raw) {
    try {
      return TransactionDirection.valueOf(raw.trim().toUpperCase());
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "invalid direction");
    }
  }

  public static TransactionDto toDto(TransactionEntity t) {
    return new TransactionDto(
        t.getId(),
        t.getHouseholdId(),
        t.getScope().name(),
        t.getOwnerUserId(),
        t.getDirection().name(),
        t.getCategory(),
        t.getAmount(),
        t.getOccurredAt(),
        t.getNote());
  }
}

