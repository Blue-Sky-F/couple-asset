package com.coupleasset.api.dto;

import java.math.BigDecimal;

public record MonthlyStatsResponse(String month, BigDecimal income, BigDecimal expense) {}

