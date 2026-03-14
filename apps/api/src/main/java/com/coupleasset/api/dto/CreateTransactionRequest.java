package com.coupleasset.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CreateTransactionRequest {
  @NotBlank
  private String scope;

  private Long ownerUserId;

  @NotBlank
  private String direction;

  @NotBlank
  private String category;

  @NotNull
  private BigDecimal amount;

  @NotNull
  private LocalDateTime occurredAt;

  private String note;

  public String getScope() {
    return scope;
  }

  public void setScope(String scope) {
    this.scope = scope;
  }

  public Long getOwnerUserId() {
    return ownerUserId;
  }

  public void setOwnerUserId(Long ownerUserId) {
    this.ownerUserId = ownerUserId;
  }

  public String getDirection() {
    return direction;
  }

  public void setDirection(String direction) {
    this.direction = direction;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public LocalDateTime getOccurredAt() {
    return occurredAt;
  }

  public void setOccurredAt(LocalDateTime occurredAt) {
    this.occurredAt = occurredAt;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}

