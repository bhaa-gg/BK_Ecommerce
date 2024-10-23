

import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { proudctModel } from '../../../DB/Models/index.js';
import { couponArgs, couponType, productObj } from '../Types/index.js';
import { createCoupon } from '../Resolvers/CouponResolves.js';


const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: {
        getAllProducts: {
            type: new GraphQLList(productObj),
            // args: { title: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: async (parent, args) => {
                return await proudctModel.find()
            }
        }
    }
})

const rootMutation = new GraphQLObjectType({
    name: 'rootMutation',
    fields: {
        addCoupon: {
            type: couponType,
            args: couponArgs,
            resolve: createCoupon
        }
    }

})

export const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation        // mutation for post processing 
    // subscription:""
})