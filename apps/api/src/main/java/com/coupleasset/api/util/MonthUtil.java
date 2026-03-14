package com.coupleasset.api.util;

import com.coupleasset.api.error.ApiException;
import java.time.LocalDateTime;
import java.time.YearMonth;
import org.springframework.http.HttpStatus;

public final class MonthUtil {
  private MonthUtil() {}

  public static Range rangeForMonth(String month) {
    try {
      YearMonth ym = YearMonth.parse(month);
      LocalDateTime start = ym.atDay(1).atStartOfDay();
      LocalDateTime end = ym.plusMonths(1).atDay(1).atStartOfDay();
      return new Range(start, end);
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "invalid month");
    }
  }

  public record Range(LocalDateTime startInclusive, LocalDateTime endExclusive) {}
}

