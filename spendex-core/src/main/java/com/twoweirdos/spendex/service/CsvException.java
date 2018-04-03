package com.twoweirdos.spendex.service;

import com.twoweirdos.spendex.SpendexException;

/**
 * @author Sean Kleinjung
 */
public class CsvException extends SpendexException {
    public CsvException() {
    }

    public CsvException(String message) {
        super(message);
    }

    public CsvException(String message, Throwable cause) {
        super(message, cause);
    }

    public CsvException(Throwable cause) {
        super(cause);
    }
}
