package com.twoweirdos.spendex.repository;

import com.twoweirdos.spendex.model.UploadedFile;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

/**
 * @author Sean Kleinjung
 */
public interface UploadedFileRepository extends CrudRepository<UploadedFile, Long> {
    UploadedFile findByFilename(String filename);
    List<UploadedFile> findByFilenameIn(Collection<String> filename);
}
