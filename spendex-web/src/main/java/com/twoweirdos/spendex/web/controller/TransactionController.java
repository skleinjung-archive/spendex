package com.twoweirdos.spendex.web.controller;

import com.twoweirdos.spendex.model.Transaction;
import com.twoweirdos.spendex.service.CsvService;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * @author Sean Kleinjung
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private CsvService csvService;

    public TransactionController(CsvService csvService) {
        Assert.notNull(csvService, "csvService cannot be null");
        this.csvService = csvService;
    }

    @PostMapping
    public void uploadTransactions(@RequestParam("files") MultipartFile[] files) throws IOException {
        System.out.println("Processing file: " + files[0].getName());
        csvService.getRecords(files[0].getInputStream(), Transaction.class)
                .subscribe(transaction -> System.out.println(transaction.toString()));
//        System.out.println(file.length);
    }
}
