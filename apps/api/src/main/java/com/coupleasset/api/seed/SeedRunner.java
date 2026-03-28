package com.coupleasset.api.seed;

import com.coupleasset.api.entity.AssetEntity;
import com.coupleasset.api.entity.AssetType;
import com.coupleasset.api.entity.HouseholdEntity;
import com.coupleasset.api.entity.HouseholdMemberEntity;
import com.coupleasset.api.entity.HouseholdRole;
import com.coupleasset.api.entity.Scope;
import com.coupleasset.api.entity.TransactionDirection;
import com.coupleasset.api.entity.TransactionEntity;
import com.coupleasset.api.entity.UserEntity;
import com.coupleasset.api.entity.UserStatus;
import com.coupleasset.api.entity.AssetHistoryEntity;
import com.coupleasset.api.repo.AssetHistoryRepository;
import com.coupleasset.api.repo.AssetRepository;
import com.coupleasset.api.repo.HouseholdMemberRepository;
import com.coupleasset.api.repo.HouseholdRepository;
import com.coupleasset.api.repo.TransactionRepository;
import com.coupleasset.api.repo.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class SeedRunner implements ApplicationRunner {
  private final SeedProperties props;
  private final UserRepository userRepo;
  private final HouseholdRepository householdRepo;
  private final HouseholdMemberRepository memberRepo;
  private final AssetRepository assetRepo;
  private final TransactionRepository txRepo;
  private final AssetHistoryRepository historyRepo;
  private final PasswordEncoder passwordEncoder;

  public SeedRunner(
      SeedProperties props,
      UserRepository userRepo,
      HouseholdRepository householdRepo,
      HouseholdMemberRepository memberRepo,
      AssetRepository assetRepo,
      TransactionRepository txRepo,
      AssetHistoryRepository historyRepo,
      PasswordEncoder passwordEncoder) {
    this.props = props;
    this.userRepo = userRepo;
    this.householdRepo = householdRepo;
    this.memberRepo = memberRepo;
    this.assetRepo = assetRepo;
    this.txRepo = txRepo;
    this.historyRepo = historyRepo;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  @Transactional
  public void run(ApplicationArguments args) {
    if (!props.isEnabled()) return;
    if (userRepo.count() > 0) return;

    String householdName = required(props.getHouseholdName(), "app.seed.householdName");
    String user1Name = required(props.getUser1Name(), "app.seed.user1Name");
    String user2Name = required(props.getUser2Name(), "app.seed.user2Name");
    String user1Phone = required(props.getUser1Phone(), "app.seed.user1Phone");
    String user2Phone = required(props.getUser2Phone(), "app.seed.user2Phone");
    String password = required(props.getPassword(), "app.seed.password");

    HouseholdEntity household = new HouseholdEntity();
    household.setName(householdName);
    household = householdRepo.save(household);

    UserEntity user1 = new UserEntity();
    user1.setDisplayName(user1Name);
    user1.setPhone(user1Phone);
    user1.setStatus(UserStatus.ACTIVE);
    user1.setPasswordHash(passwordEncoder.encode(password));
    user1 = userRepo.save(user1);

    UserEntity user2 = new UserEntity();
    user2.setDisplayName(user2Name);
    user2.setPhone(user2Phone);
    user2.setStatus(UserStatus.ACTIVE);
    user2.setPasswordHash(passwordEncoder.encode(password));
    user2 = userRepo.save(user2);

    HouseholdMemberEntity m1 = new HouseholdMemberEntity();
    m1.setHouseholdId(household.getId());
    m1.setUserId(user1.getId());
    m1.setRole(HouseholdRole.OWNER);
    memberRepo.save(m1);

    HouseholdMemberEntity m2 = new HouseholdMemberEntity();
    m2.setHouseholdId(household.getId());
    m2.setUserId(user2.getId());
    m2.setRole(HouseholdRole.MEMBER);
    memberRepo.save(m2);

    seedAssets(household.getId(), user1.getId(), user2.getId());
    seedTransactions(household.getId(), user1.getId(), user2.getId());
    seedHistory(household.getId());
  }

  private void seedHistory(long householdId) {
    LocalDate now = LocalDate.now();
    BigDecimal base = new BigDecimal("3000000");
    // Generate strictly increasing growth
    for (int i = 12; i >= 0; i--) {
      LocalDate date = now.minusMonths(i);
      String month = date.format(DateTimeFormatter.ofPattern("yyyy-MM"));
      AssetHistoryEntity h = new AssetHistoryEntity();
      h.setHouseholdId(householdId);
      h.setRecordMonth(month);
      // Strictly increasing: 1.004 ^ (12-i) growth approx 5% per year
      double factor = Math.pow(1.004, 12 - i);
      h.setTotalAmount(base.multiply(BigDecimal.valueOf(factor)));
      historyRepo.save(h);
    }
  }

  private void seedAssets(long householdId, long user1Id, long user2Id) {
    List<LegacyAsset> assets =
        List.of(
            new LegacyAsset("ESOP", "stock", "male", "863500", "长期持有"),
            new LegacyAsset("ESOP", "stock", "female", "863500", ""),
            new LegacyAsset("ESOP1", "stock", "female", "314000", ""),
            new LegacyAsset("招商银行存款", "deposit", "female", "307000", "工资卡"),
            new LegacyAsset("工商银行存款", "deposit", "male", "100000", "工资卡"),
            new LegacyAsset("嫁妆", "dowry", "male", "400000", "小王婚前财产"),
            new LegacyAsset("投资借款", "receivable", "male", "500000", ""),
            new LegacyAsset("工资收入", "salary", "male", "44300", "月薪"),
            new LegacyAsset("工资收入", "salary", "female", "38500", "月薪"));

    for (LegacyAsset a : assets) {
      AssetEntity e = new AssetEntity();
      e.setHouseholdId(householdId);
      if ("male".equals(a.owner)) {
        e.setScope(Scope.PERSONAL);
        e.setOwnerUserId(user1Id);
      } else if ("female".equals(a.owner)) {
        e.setScope(Scope.PERSONAL);
        e.setOwnerUserId(user2Id);
      } else {
        e.setScope(Scope.JOINT);
        e.setOwnerUserId(null);
      }
      e.setType(mapAssetType(a.type, a.name));
      e.setName(a.name);
      e.setAmount(new BigDecimal(a.amount));
      e.setNote(a.note == null || a.note.isBlank() ? null : a.note);
      assetRepo.save(e);
    }
  }

  private void seedTransactions(long householdId, long user1Id, long user2Id) {
    List<LegacyTx> txs =
        List.of(
            new LegacyTx("income", "income_other", "joint", "7000", "春节红包", "2026-02-10"),
            new LegacyTx("expense", "redpacket", "female", "9700", "春节红包", "2026-02-10"),
            new LegacyTx("expense", "redpacket", "male", "7700", "春节红包", "2026-02-15"));

    for (LegacyTx t : txs) {
      TransactionEntity e = new TransactionEntity();
      e.setHouseholdId(householdId);

      if ("male".equals(t.owner)) {
        e.setScope(Scope.PERSONAL);
        e.setOwnerUserId(user1Id);
      } else if ("female".equals(t.owner)) {
        e.setScope(Scope.PERSONAL);
        e.setOwnerUserId(user2Id);
      } else {
        e.setScope(Scope.JOINT);
        e.setOwnerUserId(null);
      }

      e.setDirection("income".equals(t.type) ? TransactionDirection.INCOME : TransactionDirection.EXPENSE);
      e.setCategory(t.category);
      e.setAmount(new BigDecimal(t.amount));
      e.setOccurredAt(LocalDate.parse(t.date).atStartOfDay());
      e.setNote(t.note == null || t.note.isBlank() ? null : t.note);
      txRepo.save(e);
    }
  }

  private static AssetType mapAssetType(String legacyType, String name) {
    String t = legacyType == null ? "" : legacyType.trim().toLowerCase();
    String n = name == null ? "" : name;
    if (n.toUpperCase().contains("ESOP")) return AssetType.STOCK;
    if ("deposit".equals(t) || "cash".equals(t)) return AssetType.BANK;
    if ("stock".equals(t)) return AssetType.STOCK;
    if ("dowry".equals(t)) return AssetType.DOWRY;
    if ("loan".equals(t) || "receivable".equals(t)) return AssetType.LOAN;
    if ("fund".equals(t)) return AssetType.FUND;
    return AssetType.OTHER;
  }

  private static String required(String v, String key) {
    if (v == null || v.trim().isEmpty()) {
      throw new IllegalStateException("missing seed config: " + key);
    }
    return v.trim();
  }

  private record LegacyAsset(String name, String type, String owner, String amount, String note) {}

  private record LegacyTx(String type, String category, String owner, String amount, String note, String date) {}
}
