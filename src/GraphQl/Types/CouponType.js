import { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { DiscountType } from "../../Utils/index.js";





const couponTypeField = new GraphQLEnumType({
    name: 'CouponType',
    values: {
        Percentage: { value: DiscountType.PERCENTAGE },
        Fixed: { value: DiscountType.FIXED },
    }
})

const UserTypeField = new GraphQLObjectType({
    name: 'UserUsageField',
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLString) }, // Assuming ObjectId is represented as a string
        maxCount: { type: new GraphQLNonNull(GraphQLInt) },
        usageCount: { type: GraphQLInt, defaultValue: 0 },
    }
});



export const couponType = new GraphQLObjectType({
    name: 'Coupon',
    fields: {
        _id: { type: GraphQLString },
        couponCode: { type: GraphQLString },
        couponAmount: { type: GraphQLInt },
        couponType: {
            type: couponTypeField
        },
        from: { type: GraphQLString },
        till: { type: GraphQLString },
        // Users: {
        //     type: new GraphQLList(UserTypeField)
        // },
        isEnabled: { type: GraphQLBoolean },
        createdBy: { type: GraphQLString },
    }
})


export const couponArgs = {
    couponCode: { type: GraphQLString },
    couponAmount: { type: GraphQLInt },
    couponType: {
        type: couponTypeField
    },
    from: { type: GraphQLString },
    till: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    myToken: { type: GraphQLString },
    // Users: {
    //     type: new GraphQLList(UserTypeField)
    // },
}