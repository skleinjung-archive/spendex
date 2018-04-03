package com.twoweirdos.spendex.repository;

import com.twoweirdos.spendex.model.Transaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * @author Sean Kleinjung
 */
@Repository
public interface TransactionRepository extends CrudRepository<Transaction, Long> {
}
