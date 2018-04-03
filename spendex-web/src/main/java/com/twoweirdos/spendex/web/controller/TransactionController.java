package com.twoweirdos.spendex.web.controller;

import com.twoweirdos.spendex.model.Transaction;
import com.twoweirdos.spendex.model.TransactionUploadResult;
import com.twoweirdos.spendex.model.UploadedFile;
import com.twoweirdos.spendex.repository.TransactionRepository;
import com.twoweirdos.spendex.repository.UploadedFileRepository;
import com.twoweirdos.spendex.service.CsvService;
import com.twoweirdos.spendex.web.model.TransactionView;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

/**
 * @author Sean Kleinjung
 */
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

    private CsvService csvService;
    private UploadedFileRepository uploadedFileRepository;
    private TransactionRepository transactionRepository;

    public TransactionController(CsvService csvService, UploadedFileRepository uploadedFileRepository, TransactionRepository transactionRepository) {
        Assert.notNull(csvService, "csvService cannot be null");
        this.csvService = csvService;

        Assert.notNull(uploadedFileRepository, "uploadedFileRepository cannot be null");
        this.uploadedFileRepository = uploadedFileRepository;

        Assert.notNull(transactionRepository, "transactionRepository cannot be null");
        this.transactionRepository = transactionRepository;
    }

    @GetMapping
    public List<TransactionView> findAll(@RequestParam(name = "month", required = false, defaultValue = "-1") int month,
                                         @RequestParam(name = "year", required = false) int year,
                                         @RequestParam(name = "sortColumn", required = false) String sortColumn,
                                         @RequestParam(name = "descending", required = false) boolean descending) {
        if (sortColumn == null || "".equals(sortColumn.trim())) {
            sortColumn = "date";
        }

        Calendar currentCalendar = Calendar.getInstance();
        currentCalendar.setTime(new Date());
        if (month == -1) {
            month = currentCalendar.get(Calendar.MONTH);
        }
        if (year == 0) {
            year = currentCalendar.get(Calendar.YEAR);
        }

        LocalDateTime start = LocalDateTime.of(year, month + 1, 1, 0, 0);
        LocalDateTime end = start.with(lastDayOfMonth());

        Date startDate = Date.from(start.atZone(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(end.atZone(ZoneId.systemDefault()).toInstant());

        Sort sort = new Sort(descending ? Sort.Direction.DESC : Sort.Direction.ASC, sortColumn);
        List<Transaction> transactions = transactionRepository.findByDateBetween(startDate, endDate, sort);
        return transactions.stream().map(TransactionView::new).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<TransactionUploadResult> uploadTransactions(@RequestParam("files") MultipartFile[] files) throws IOException {
        TransactionUploadResult result;

        List<String> previouslyUploadedFiles = getPreviouslyUploadedFileNames(files);
        if (!previouslyUploadedFiles.isEmpty()) {
            result = new TransactionUploadResult();
            result.setStatus(TransactionUploadResult.Status.Error);
            result.setRows(0);
            result.setMessage("Please upload a file with a different name. (Duplicate file(s): " + previouslyUploadedFiles + ")");
        } else {
            result = processFiles(files);
        }

        return ResponseEntity.ok(result);
    }

    private List<String> getPreviouslyUploadedFileNames(MultipartFile[] files) {
        List<String> filenames = new ArrayList<>(files.length);
        for (MultipartFile file : files) {
            filenames.add(file.getOriginalFilename());
        }

        List<UploadedFile> previouslyUploadedFiles = uploadedFileRepository.findByFilenameIn(filenames);
        return previouslyUploadedFiles.stream().map(UploadedFile::getFilename).collect(Collectors.toList());
    }

    private TransactionUploadResult processFiles(MultipartFile[] files) {
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
            log.error(String.format("Error processing transaction file '%s': %s", currentFileName, e.toString()), e);

            result.setStatus(TransactionUploadResult.Status.Error);
            result.setMessage(String.format("Error processing file '%s': %s", currentFileName, e.getMessage()));
        }
        return result;
    }

    private int processFile(MultipartFile file) throws IOException {
        UploadedFile uploadedFile = new UploadedFile();
        uploadedFile.setFilename(file.getOriginalFilename());
        uploadedFile.setUploadTime(new Date());

        Iterable<Transaction> transactions = csvService.getRecords(file.getInputStream(), Transaction.class)
                .blockingIterable();

        int rowCount = 0;
        for (Transaction transaction : transactions) {
            log.info(transaction.toString());
            transaction.setUploadedFile(uploadedFile);
            rowCount++;
        }

        uploadedFileRepository.save(uploadedFile);
        return rowCount;
    }
}
