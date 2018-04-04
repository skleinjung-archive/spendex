package com.twoweirdos.spendex.web.model;

import com.twoweirdos.spendex.model.TransactionUploadResult;

/**
 * @author Sean Kleinjung
 */
public class SaveResult {
    public enum Status {
        Success,
        Error
    }

    private Status status;
    private String message;

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
}
