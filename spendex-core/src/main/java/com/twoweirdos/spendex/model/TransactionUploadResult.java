package com.twoweirdos.spendex.model;

/**
 * @author Sean Kleinjung
 */
public class TransactionUploadResult {
    public enum Status {
        Success,
        Error
    }

    private Status status;
    private String message;
    private int rows;

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getRows() {
        return rows;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }
}
