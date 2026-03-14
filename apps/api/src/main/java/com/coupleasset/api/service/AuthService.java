package com.coupleasset.api.service;

import com.coupleasset.api.auth.JwtService;
import com.coupleasset.api.dto.AuthResponse;
import com.coupleasset.api.dto.HouseholdDto;
import com.coupleasset.api.dto.HouseholdMemberDto;
import com.coupleasset.api.dto.LoginRequest;
import com.coupleasset.api.dto.RegisterRequest;
import com.coupleasset.api.dto.UserDto;
import com.coupleasset.api.entity.HouseholdEntity;
import com.coupleasset.api.entity.HouseholdMemberEntity;
import com.coupleasset.api.entity.HouseholdRole;
import com.coupleasset.api.entity.UserEntity;
import com.coupleasset.api.entity.UserStatus;
import com.coupleasset.api.error.ApiException;
import com.coupleasset.api.repo.HouseholdMemberRepository;
import com.coupleasset.api.repo.HouseholdRepository;
import com.coupleasset.api.repo.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository userRepo;
  private final HouseholdRepository householdRepo;
  private final HouseholdMemberRepository memberRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final HouseholdService householdService;

  public AuthService(
      UserRepository userRepo,
      HouseholdRepository householdRepo,
      HouseholdMemberRepository memberRepo,
      PasswordEncoder passwordEncoder,
      JwtService jwtService,
      HouseholdService householdService) {
    this.userRepo = userRepo;
    this.householdRepo = householdRepo;
    this.memberRepo = memberRepo;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
    this.householdService = householdService;
  }

  @Transactional
  public AuthResponse register(RegisterRequest req) {
    String email = normalize(req.getEmail());
    String phone = normalize(req.getPhone());
    if ((email == null || email.isBlank()) && (phone == null || phone.isBlank())) {
      throw new ApiException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "email or phone required");
    }
    if (email != null && userRepo.findByEmailIgnoreCase(email).isPresent()) {
      throw new ApiException(HttpStatus.CONFLICT, "EMAIL_EXISTS", "email already exists");
    }
    if (phone != null && userRepo.findByPhone(phone).isPresent()) {
      throw new ApiException(HttpStatus.CONFLICT, "PHONE_EXISTS", "phone already exists");
    }

    UserEntity user = new UserEntity();
    user.setEmail(email);
    user.setPhone(phone);
    user.setDisplayName(req.getDisplayName().trim());
    user.setStatus(UserStatus.ACTIVE);
    user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
    user = userRepo.save(user);

    HouseholdEntity household = new HouseholdEntity();
    String householdName = normalize(req.getHouseholdName());
    household.setName(householdName == null || householdName.isBlank() ? "家庭" : householdName);
    household = householdRepo.save(household);

    HouseholdMemberEntity member = new HouseholdMemberEntity();
    member.setHouseholdId(household.getId());
    member.setUserId(user.getId());
    member.setRole(HouseholdRole.OWNER);
    memberRepo.save(member);

    String token = jwtService.issueAccessToken(user.getId());
    HouseholdDto householdDto = new HouseholdDto(household.getId(), household.getName());
    List<HouseholdMemberDto> members = householdService.listMembers(household.getId());
    return new AuthResponse(token, toUserDto(user), householdDto, members);
  }

  public AuthResponse login(LoginRequest req) {
    String identifier = req.getIdentifier().trim();
    UserEntity user =
        (identifier.contains("@")
                ? userRepo.findByEmailIgnoreCase(identifier)
                : userRepo.findByPhone(identifier))
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "invalid credentials"));

    if (user.getStatus() == UserStatus.DISABLED) {
      throw new ApiException(HttpStatus.FORBIDDEN, "USER_DISABLED", "user disabled");
    }
    if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "invalid credentials");
    }

    long householdId = householdService.requireHouseholdIdByUserId(user.getId());
    HouseholdDto household = householdService.getHousehold(householdId);
    List<HouseholdMemberDto> members = householdService.listMembers(householdId);
    String token = jwtService.issueAccessToken(user.getId());
    return new AuthResponse(token, toUserDto(user), household, members);
  }

  private static String normalize(String s) {
    if (s == null) return null;
    String t = s.trim();
    return t.isEmpty() ? null : t;
  }

  public static UserDto toUserDto(UserEntity u) {
    return new UserDto(u.getId(), u.getEmail(), u.getPhone(), u.getDisplayName(), u.getStatus().name());
  }
}

