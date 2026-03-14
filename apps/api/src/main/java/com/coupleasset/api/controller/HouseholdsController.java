package com.coupleasset.api.controller;

import com.coupleasset.api.auth.AuthContext;
import com.coupleasset.api.dto.HouseholdDto;
import com.coupleasset.api.dto.HouseholdMeResponse;
import com.coupleasset.api.dto.HouseholdMemberDto;
import com.coupleasset.api.service.HouseholdService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/households")
public class HouseholdsController {
  private final HouseholdService householdService;

  public HouseholdsController(HouseholdService householdService) {
    this.householdService = householdService;
  }

  @GetMapping("/me")
  public HouseholdMeResponse me() {
    long userId = AuthContext.requireUserId();
    long householdId = householdService.requireHouseholdIdByUserId(userId);
    HouseholdDto household = householdService.getHousehold(householdId);
    List<HouseholdMemberDto> members = householdService.listMembers(householdId);
    return new HouseholdMeResponse(household, members);
  }
}

