package com.coupleasset.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class TransactionEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "household_id", nullable = false)
  private Long householdId;

  @Enumerated(EnumType.STRING)
  @Column(name = "scope", nullable = false)
  private Scope scope;

  @Column(name = "owner_user_id")
  private Long ownerUserId;

  @Enumerated(EnumType.STRING)
  @Column(name = "direction", nullable = false)
  private TransactionDirection direction;

  @Column(name = "category", nullable = false)
  private String category;

  @Column(name = "amount", nullable = false, precision = 19, scale = 2)
  private BigDecimal amount;

  @Column(name = "occurred_at", nullable = false)
  private LocalDateTime occurredAt;

  @Column(name = "note")
  private String note;

  @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false, insertable = false, updatable = false)
  private LocalDateTime updatedAt;

  public Long getId() {
    return id;
  }

  public Long getHouseholdId() {
    return householdId;
  }

  public void setHouseholdId(Long householdId) {
    this.householdId = householdId;
  }

  public Scope getScope() {
    return scope;
  }

  public void setScope(Scope scope) {
    this.scope = scope;
  }

  public Long getOwnerUserId() {
    return ownerUserId;
  }

  public void setOwnerUserId(Long ownerUserId) {
    this.ownerUserId = ownerUserId;
  }

  public TransactionDirection getDirection() {
    return direction;
  }

  public void setDirection(TransactionDirection direction) {
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

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }
}

