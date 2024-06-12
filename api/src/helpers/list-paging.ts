export interface IPropsPaging {
    where?: any;
    orderBy?: any;
    include?: any;
}

export interface IFuncPaging {
    items: any[];
    totalItems?: number;
    currentPage?: number;
    totalPage?: number;
    perPage?: number;
}

export const funcListPaging = async (
    service: any,
    options: IPropsPaging,
    page?: number,
    perPage?: number,
): Promise<IFuncPaging> => {
    const { include, where, orderBy } = options;
    // setup filter
    let items: Array<any>;
    let totalItems: number;
    let totalPage: number;
    let allFilter;
    const limit = isNaN(perPage) ? 10 : perPage;
    const offset = isNaN(page) ? 1 : page;

    allFilter = { where }; // filter default
    if (orderBy) allFilter = { ...allFilter, orderBy };
    if (include) allFilter = { ...allFilter, include };

    if (perPage && page) {
        // filter for paging
        allFilter = { ...allFilter, take: limit };
        allFilter = { ...allFilter, skip: (offset - 1) * limit };
    }

    // query
    items = await service.findAll(allFilter);
    totalItems = await service.count({ where: where });
    totalPage = Math.floor((totalItems + (limit - 1)) / limit) ?? 1;
    return {
        items,
        totalItems,
        currentPage: page,
        totalPage,
        perPage: limit,
    };
};
