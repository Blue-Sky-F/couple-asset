package com.coupleasset.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionDto(
    long id,
    long householdId,
    String scope,
    Long ownerUserId,
    String direction,
    String category,
    BigDecimal amount,
    LocalDateTime occurredAt,
    String note) {}

