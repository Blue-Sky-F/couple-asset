package com.coupleasset.api.dto;

import java.util.List;

public record AuthResponse(
    String accessToken, UserDto user, HouseholdDto household, List<HouseholdMemberDto> members) {}

