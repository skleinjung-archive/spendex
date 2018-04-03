package com.twoweirdos.spendex.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

/**
 * @author Sean Kleinjung
 */
@Entity
@Table(name = "spendex_transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private UploadedFile uploadedFile;

    @Column(name = "transaction_date")
    private Date date;

    private BigDecimal amount;
    private String description;
    private String category;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public UploadedFile getUploadedFile() {
        return uploadedFile;
    }

    public void setUploadedFile(UploadedFile uploadedFile) {
        if (this.uploadedFile != null) {
            this.uploadedFile.removeTransaction(this);
        }

        this.uploadedFile = uploadedFile;

        if (this.uploadedFile != null) {
            this.uploadedFile.addTransaction(this);
        }
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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

    @Override
    public String toString() {
        return "Transaction{" +
                "id=" + id +
                ", date=" + date +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}
