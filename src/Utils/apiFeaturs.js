

export class apiFeaturs {
    constructor(mongoosequery, query) {
        this.mongoosequery = mongoosequery
        this.query = query
    }
    sort() {
        if (this.query.sort) {
            const sort = this.query.sort.split(",").join(" ");
            this.mongoosequery.sort(sort);
        }
        return this;
    }
    fields() {

        if (this.query.fields) {

            let fields = this.query.fields.split(",").join(" ");


            this.mongoosequery.select(fields);
        }
        return this;
    }
    search() {
        let search = "";
        if (this.query.search) {
            search = this.query.search
            this.mongoosequery.find({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { slug: { $regex: search, $options: "i" } }
                ]
            });
        }
        return this;
    }
    paginataion() {
        const { page = 1, limit = 2 } = this.query
        const skip = (page - 1) * limit
        this.mongoosequery.skip(skip).limit(limit)
        return this
    }
    filters() {
        const { page, limit, sort, fields, search, ...filters } = this.query

        const filtersString = JSON.stringify(filters).replaceAll(/eq|gte|lte|gt|lt/g, pat => `$${pat}`);

        const finalFilters = JSON.parse(filtersString)

        this.mongoosequery.find(finalFilters);

        return this;
    }
}   