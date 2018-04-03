package com.twoweirdos.spendex;

import com.twoweirdos.spendex.model.Transaction;
import com.twoweirdos.spendex.service.CsvService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

/**
 * @author Sean Kleinjung
 */
public class Application {
    private static final Logger log = LoggerFactory.getLogger(Application.class);

    public static void main(String[] args) {
        SpringApplication.run(Application.class);
    }

    public CommandLineRunner demo(final CsvService csv) {
        return (args) -> {
            csv.getRecords(Application.class.getResourceAsStream("/transactions.csv"), Transaction.class)
                    .map(Transaction::toString)
                    .subscribe(log::info);

            log.info("Application ran successfully.");
        };
    }
}
