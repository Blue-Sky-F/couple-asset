package com.coupleasset.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class UpdateAssetRequest {
  @NotBlank
  private String scope;

  private Long ownerUserId;

  @NotBlank
  private String type;

  @NotBlank
  private String name;

  @NotNull
  private BigDecimal amount;

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

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getNote() {
    return note;
  }

  public void setNote(String note) {
    this.note = note;
  }
}

