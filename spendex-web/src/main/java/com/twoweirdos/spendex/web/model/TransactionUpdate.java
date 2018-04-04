package com.twoweirdos.spendex.web.model;

/**
 * @author Sean Kleinjung
 */
public class TransactionUpdate {
    private long id;
    private String category;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
