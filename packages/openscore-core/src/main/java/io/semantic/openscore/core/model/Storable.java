package io.semantic.openscore.core.model;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
public class Storable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private boolean deleted;
    private Date creationDate;
    private Date deletionDate;
    private Date modificationDate;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getDeletionDate() {
        return deletionDate;
    }

    public void setDeletionDate(Date deletionDate) {
        this.deletionDate = deletionDate;
    }

    public Date getModificationDate() {
        return modificationDate;
    }

    public void setModificationDate(Date modificationDate) {
        this.modificationDate = modificationDate;
    }

    @PrePersist
    public void prePersist() {
        if (this.id == 0) {
            this.creationDate = new Date();
        }
        if (this.deleted) {
            this.deletionDate = new Date();
        }
        this.modificationDate = new Date();
    }
}
