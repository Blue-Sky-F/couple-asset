package com.coupleasset.api.controller;

import com.coupleasset.api.auth.AuthContext;
import com.coupleasset.api.dto.CreateTransactionRequest;
import com.coupleasset.api.dto.TransactionDto;
import com.coupleasset.api.dto.UpdateTransactionRequest;
import com.coupleasset.api.service.TransactionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/transactions")
public class TransactionsController {
  private final TransactionService txService;

  public TransactionsController(TransactionService txService) {
    this.txService = txService;
  }

  @GetMapping
  public List<TransactionDto> list(
      @RequestParam(name = "month") String month,
      @RequestParam(name = "scope", required = false) String scope,
      @RequestParam(name = "ownerUserId", required = false) Long ownerUserId) {
    long userId = AuthContext.requireUserId();
    return txService.list(userId, month, scope, ownerUserId);
  }

  @PostMapping
  public TransactionDto create(@Valid @RequestBody CreateTransactionRequest req) {
    long userId = AuthContext.requireUserId();
    return txService.create(userId, req);
  }

  @PutMapping("/{id}")
  public TransactionDto update(@PathVariable("id") long id, @Valid @RequestBody UpdateTransactionRequest req) {
    long userId = AuthContext.requireUserId();
    return txService.update(userId, id, req);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("id") long id) {
    long userId = AuthContext.requireUserId();
    txService.delete(userId, id);
  }
}

