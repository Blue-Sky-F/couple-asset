package com.coupleasset.api.service;

import com.coupleasset.api.dto.AssetDto;
import com.coupleasset.api.dto.CreateAssetRequest;
import com.coupleasset.api.dto.UpdateAssetRequest;
import com.coupleasset.api.entity.AssetEntity;
import com.coupleasset.api.entity.AssetType;
import com.coupleasset.api.entity.Scope;
import com.coupleasset.api.error.ApiException;
import com.coupleasset.api.repo.AssetRepository;
import com.coupleasset.api.repo.HouseholdMemberRepository;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssetService {
  private final AssetRepository assetRepo;
  private final HouseholdService householdService;
  private final HouseholdMemberRepository memberRepo;

  public AssetService(
      AssetRepository assetRepo, HouseholdService householdService, HouseholdMemberRepository memberRepo) {
    this.assetRepo = assetRepo;
    this.householdService = householdService;
    this.memberRepo = memberRepo;
  }

  public List<AssetDto> list(long userId, String scope, Long ownerUserId) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    List<AssetEntity> all = assetRepo.findByHouseholdId(householdId);
    return all.stream()
        .filter(a -> scope == null || a.getScope().name().equalsIgnoreCase(scope))
        .filter(a -> ownerUserId == null || (a.getOwnerUserId() != null && a.getOwnerUserId().equals(ownerUserId)))
        .map(AssetService::toDto)
        .toList();
  }

  @Transactional
  public AssetDto create(long userId, CreateAssetRequest req) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    AssetEntity a = new AssetEntity();
    a.setHouseholdId(householdId);
    apply(a, householdId, req.getScope(), req.getOwnerUserId(), req.getType(), req.getName(), req.getAmount(), req.getNote());
    return toDto(assetRepo.save(a));
  }

  @Transactional
  public AssetDto update(long userId, long assetId, UpdateAssetRequest req) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    AssetEntity a = requireOwned(assetId, householdId);
    apply(a, householdId, req.getScope(), req.getOwnerUserId(), req.getType(), req.getName(), req.getAmount(), req.getNote());
    return toDto(a);
  }

  @Transactional
  public void delete(long userId, long assetId) {
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    AssetEntity a = requireOwned(assetId, householdId);
    assetRepo.delete(a);
  }

  private AssetEntity requireOwned(long assetId, long householdId) {
    AssetEntity a =
        assetRepo
            .findById(assetId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "not found"));
    if (!a.getHouseholdId().equals(householdId)) {
      throw new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "not found");
    }
    return a;
  }

  private void apply(
      AssetEntity a,
      long householdId,
      String scopeRaw,
      Long ownerUserId,
      String typeRaw,
      String name,
      java.math.BigDecimal amount,
      String note) {
    Scope scope = parseScope(scopeRaw);
    AssetType type = parseAssetType(typeRaw);
    if (scope == Scope.PERSONAL) {
      if (ownerUserId == null) {
        throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "ownerUserId required");
      }
      ensureMember(householdId, ownerUserId);
      a.setOwnerUserId(ownerUserId);
    } else {
      a.setOwnerUserId(null);
    }
    a.setScope(scope);
    a.setType(type);
    a.setName(name.trim());
    a.setAmount(amount);
    a.setNote(note == null ? null : note.trim());
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

  private static AssetType parseAssetType(String raw) {
    try {
      return AssetType.valueOf(raw.trim().toUpperCase());
    } catch (Exception e) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "invalid type");
    }
  }

  public static AssetDto toDto(AssetEntity a) {
    return new AssetDto(
        a.getId(),
        a.getHouseholdId(),
        a.getScope().name(),
        a.getOwnerUserId(),
        a.getType().name(),
        a.getName(),
        a.getAmount(),
        a.getNote());
  }
}

