package com.twoweirdos.spendex.web.controller;

import com.twoweirdos.spendex.model.Transaction;
import com.twoweirdos.spendex.model.TransactionUploadResult;
import com.twoweirdos.spendex.service.CsvService;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicInteger;

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
    public ResponseEntity<TransactionUploadResult> uploadTransactions(@RequestParam("files") MultipartFile[] files) throws IOException {
        TransactionUploadResult result = new TransactionUploadResult();
        result.setStatus(TransactionUploadResult.Status.Success);

        int rows = 0;
        String currentFileName = "";
        try {
            for (MultipartFile file : files) {
                currentFileName = file.getOriginalFilename();
                rows += processFile(file);
            }

            result.setMessage(String.format("File(s) uploaded successfully. %d transactions were imported.", rows));
            result.setRows(rows);
        } catch (Exception e){
            result.setStatus(TransactionUploadResult.Status.Error);
            result.setMessage(String.format("Error processing file '%s': %s", currentFileName, e.getMessage()));
        }

        return ResponseEntity.ok(result);
    }

    private int processFile(MultipartFile file) throws IOException {
        Iterable<Transaction> transactions = csvService.getRecords(file.getInputStream(), Transaction.class)
                .blockingIterable();

        int rowCount = 0;
        for (Transaction transaction : transactions) {
            rowCount++;
        }
        return rowCount;
    }
}
