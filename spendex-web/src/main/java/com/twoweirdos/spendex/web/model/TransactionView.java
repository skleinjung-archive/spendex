package com.twoweirdos.spendex.web.model;

import com.twoweirdos.spendex.model.Transaction;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author Sean Kleinjung
 */
public class TransactionView {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");

    private long id;
    private String uploadedFileName;
    private String dateString;
    private int week;
    private BigDecimal amount;
    private String description;
    private String category;

    public TransactionView(Transaction transaction) {
        id = transaction.getId();
        uploadedFileName = transaction.getUploadedFile().getFilename();
        dateString = dateFormat.format(transaction.getDate());
        week = transaction.getWeek();
        amount = transaction.getAmount();
        description = transaction.getDescription();
        category = transaction.getCategory();
    }

    public long getId() {
        return id;
    }

    public String getUploadedFileName() {
        return uploadedFileName;
    }

    public void setUploadedFileName(String uploadedFileName) {
        this.uploadedFileName = uploadedFileName;
    }

    public String getDateString() {
        return dateString;
    }

    public void setDateString(String dateString) {
        this.dateString = dateString;
    }

    public int getWeek() {
        return week;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
