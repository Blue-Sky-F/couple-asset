package com.coupleasset.api.dto;

import java.util.List;

public record HouseholdMeResponse(HouseholdDto household, List<HouseholdMemberDto> members) {}

