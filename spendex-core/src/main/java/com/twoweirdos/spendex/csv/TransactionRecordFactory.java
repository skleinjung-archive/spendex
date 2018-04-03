package com.twoweirdos.spendex.csv;

import com.twoweirdos.spendex.model.Transaction;
import com.twoweirdos.spendex.service.CsvException;
import com.twoweirdos.spendex.service.CsvRecordFactory;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;

/**
 * @author Sean Kleinjung
 */
@Component
public class TransactionRecordFactory implements CsvRecordFactory<Transaction> {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

    @Override
    public Class<Transaction> getRecordClass() {
        return Transaction.class;
    }

    @Override
    public Transaction createRecord(CSVRecord rowData) {
        Transaction transaction = new Transaction();
        transaction.setAmount(new BigDecimal(rowData.get("Amount").replaceAll("[()$,]", "")));
        transaction.setDescription(rowData.get("Description"));
        try {
            transaction.setDate(dateFormat.parse(rowData.get("Date")));
        } catch (ParseException e) {
            throw new CsvException("Invalid date format: " + rowData.get("Date"));
        }
        return transaction;
    }
}
