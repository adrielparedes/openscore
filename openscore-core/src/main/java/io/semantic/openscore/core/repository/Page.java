package io.semantic.openscore.core.repository;

public class Page {

    private int page;
    private int pageSize;

    public Page(int page,
                int pageSize) {

        this.page = page;
        this.pageSize = pageSize;
    }

    public int getPage() {
        return page;
    }

    public int getPageSize() {
        return pageSize;
    }
}
