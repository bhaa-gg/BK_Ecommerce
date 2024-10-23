import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const CategoryTypeField = new GraphQLObjectType({
    name: 'CategoryTypeField',
    fields: {
        name: { type: GraphQLString },
        slug: { type: GraphQLString },
        ceratedBy: { type: GraphQLString },
        customId: { type: GraphQLString },
        Images: {
            type: new GraphQLObjectType({
                name: 'CattImages',
                fields: {
                    secure_url: { type: GraphQLString },
                    public_id: { type: GraphQLString }
                }
            })
        },

    }
});
