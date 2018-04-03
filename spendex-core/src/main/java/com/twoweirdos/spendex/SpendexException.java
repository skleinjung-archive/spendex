package com.twoweirdos.spendex;

/**
 * @author Sean Kleinjung
 */
public class SpendexException extends RuntimeException {
    public SpendexException() {
    }

    public SpendexException(String message) {
        super(message);
    }

    public SpendexException(String message, Throwable cause) {
        super(message, cause);
    }

    public SpendexException(Throwable cause) {
        super(cause);
    }
}
