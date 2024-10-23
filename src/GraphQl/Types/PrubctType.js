import { GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { CategoryTypeField } from './CategryType.js';
import { categoryModel } from "../../../DB/Models/category.js";





export const productObj = new GraphQLObjectType({
    name: 'Product',
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        slug: { type: new GraphQLNonNull(GraphQLString) },
        overview: { type: GraphQLString },
        badge: { type: GraphQLString },

        price: { type: new GraphQLNonNull(GraphQLFloat) },
        appliedDiscount: {
            type: new GraphQLObjectType({
                name: 'AppliedDiscount',
                fields: {
                    amount: { type: GraphQLFloat },
                    type: {
                        type: new GraphQLEnumType({
                            name: 'Amount',
                            values: {
                                Percentage: { type: GraphQLString },
                                Fixed: { type: GraphQLString },
                            }
                        })
                    } // Use an enum if you have predefined values
                }
            })
        },
        appliedPrice: { type: new GraphQLNonNull(GraphQLFloat) },
        stock: { type: new GraphQLNonNull(GraphQLInt) },
        rating: { type: GraphQLFloat },

        // Images Section
        images: {
            type: new GraphQLObjectType({
                name: 'Images',
                fields: {
                    URLs: {
                        type: new GraphQLList(new GraphQLObjectType({
                            name: 'ImageUrl',
                            fields: {
                                secure_url: { type: GraphQLString },
                                public_id: { type: GraphQLString },
                            }
                        }))
                    },
                    customId: { type: GraphQLString }
                }
            })
        },

        // Reference Fields
        categoryId: {
            type: CategoryTypeField,
            resolve: async (parent, args) => {
                return await categoryModel.findById(parent.categoryId)
            }
        }, // Use GraphQLString to represent ObjectId
        subCategoryId: { type: new GraphQLNonNull(GraphQLString) },
        brandId: { type: new GraphQLNonNull(GraphQLString) },
        createdBy: { type: GraphQLString }, // This could be nullable since it's not required
    }
});