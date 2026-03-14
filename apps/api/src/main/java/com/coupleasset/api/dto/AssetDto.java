package com.coupleasset.api.dto;

import java.math.BigDecimal;

public record AssetDto(
    long id, long householdId, String scope, Long ownerUserId, String type, String name, BigDecimal amount, String note) {}

