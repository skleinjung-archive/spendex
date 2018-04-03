package com.twoweirdos.spendex.csv;

import com.twoweirdos.spendex.model.Transaction;
import com.twoweirdos.spendex.service.CsvRecordFactory;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * @author Sean Kleinjung
 */
@Component
public class TransactionRecordFactory implements CsvRecordFactory<Transaction> {
    @Override
    public Class<Transaction> getRecordClass() {
        return Transaction.class;
    }

    @Override
    public Transaction createRecord(CSVRecord rowData) {
        Transaction transaction = new Transaction();
        transaction.setAmount(new BigDecimal(rowData.get("Amount").replaceAll("[()$,]", "")));
        transaction.setDescription(rowData.get("Description"));
        transaction.setDate(null);
        return transaction;
    }
}
