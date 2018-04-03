package com.twoweirdos.spendex.service;

import io.reactivex.Observable;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Sean Kleinjung
 */
@Service
public class CsvService {
    private Map<Class, CsvRecordFactory> recordFactories = new HashMap<>();

    public <T> Observable<T> getRecords(final InputStream csvStream, Class<T> recordClass) {
        InputStreamReader reader = new InputStreamReader(csvStream);
        return getRecords(reader, recordClass);
    }

    public <T> Observable<T> getRecords(final Reader csvReader, Class<T> recordClass) {
        return Observable.create(emitter -> {
            final CSVParser parser = new CSVParser(csvReader, CSVFormat.EXCEL.withHeader());
            for (final CSVRecord row : parser) {
                if (emitter.isDisposed()) {
                    break;
                }

                emitter.onNext(createRecord(row, recordClass));
            }

            parser.close();
        });
    }

    @Autowired(required = false)
    public void setRecordFactories(List<CsvRecordFactory> recordFactories) {
        if (recordFactories != null) {
            for (CsvRecordFactory factory : recordFactories) {
                if (this.recordFactories.containsKey(factory.getRecordClass())) {
                    throw new CsvException("Duplicate factory registered for record type: " + factory.getRecordClass());
                }
                this.recordFactories.put(factory.getRecordClass(), factory);
            }
        }
    }

    private <T> T createRecord(CSVRecord row, Class<T> recordClass) {
        CsvRecordFactory factory = recordFactories.get(recordClass);
        if (factory == null) {
            throw new CsvException("No record factory registered for type: " + recordClass);
        }

        //noinspection unchecked
        return (T) factory.createRecord(row);
    }


    /**
     * Decapitalize first letter, and replace whitespace with nothing. Assumes each word is uppercased to make camel
     * casing work.
     */
    private String getPropertyNameFromHeader(String header) {
        return StringUtils.uncapitalize(header).replaceAll("\\s", "");
    }

}
