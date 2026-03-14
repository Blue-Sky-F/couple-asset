package com.coupleasset.api.service;

import com.coupleasset.api.dto.HouseholdDto;
import com.coupleasset.api.dto.HouseholdMemberDto;
import com.coupleasset.api.entity.HouseholdEntity;
import com.coupleasset.api.entity.HouseholdMemberEntity;
import com.coupleasset.api.entity.UserEntity;
import com.coupleasset.api.error.ApiException;
import com.coupleasset.api.repo.HouseholdMemberRepository;
import com.coupleasset.api.repo.HouseholdRepository;
import com.coupleasset.api.repo.UserRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class HouseholdService {
  private final HouseholdMemberRepository memberRepo;
  private final HouseholdRepository householdRepo;
  private final UserRepository userRepo;

  public HouseholdService(
      HouseholdMemberRepository memberRepo, HouseholdRepository householdRepo, UserRepository userRepo) {
    this.memberRepo = memberRepo;
    this.householdRepo = householdRepo;
    this.userRepo = userRepo;
  }

  public long requireHouseholdIdByUserId(long userId) {
    return memberRepo
        .findFirstByUserId(userId)
        .map(HouseholdMemberEntity::getHouseholdId)
        .orElseThrow(() -> new ApiException(HttpStatus.FORBIDDEN, "NO_HOUSEHOLD", "no household"));
  }

  public HouseholdDto getHousehold(long householdId) {
    HouseholdEntity h =
        householdRepo
            .findById(householdId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "NOT_FOUND", "not found"));
    return new HouseholdDto(h.getId(), h.getName());
  }

  public List<HouseholdMemberDto> listMembers(long householdId) {
    List<HouseholdMemberEntity> memberships = memberRepo.findByHouseholdId(householdId);
    List<Long> userIds = memberships.stream().map(HouseholdMemberEntity::getUserId).toList();
    Map<Long, UserEntity> usersById =
        userRepo.findAllById(userIds).stream().collect(Collectors.toMap(UserEntity::getId, Function.identity()));

    return memberships.stream()
        .map(
            m -> {
              UserEntity u = usersById.get(m.getUserId());
              String displayName = u == null ? null : u.getDisplayName();
              return new HouseholdMemberDto(m.getUserId(), displayName, m.getRole().name());
            })
        .sorted(Comparator.comparing(HouseholdMemberDto::role).thenComparing(HouseholdMemberDto::userId))
        .toList();
  }
}

