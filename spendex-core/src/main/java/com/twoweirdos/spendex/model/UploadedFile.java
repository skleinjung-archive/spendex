package com.twoweirdos.spendex.model;

import javax.persistence.*;
import java.util.*;

/**
 * @author Sean Kleinjung
 */
@Entity
public class UploadedFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String filename;
    private Date uploadTime;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "uploadedFile")
    private Set<Transaction> transactions = new HashSet<>();

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public Date getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(Date uploadTime) {
        this.uploadTime = uploadTime;
    }

    public Set<Transaction> getTransactions() {
        return new HashSet<>(transactions);
    }

    void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }

    void removeTransaction(Transaction transaction) {
        transactions.remove(transaction);
    }
}
