package com.twoweirdos.spendex.service;

import org.apache.commons.csv.CSVRecord;

/**
 * @author Sean Kleinjung
 */
public interface CsvRecordFactory<T> {
    Class<T> getRecordClass();

    T createRecord(CSVRecord rowData);
}
