import { Document, model, Schema } from "mongoose";


interface IItems extends Document {
	_products: [Schema.Types.ObjectId]
	_bundles: [Schema.Types.ObjectId]
}

interface IWishlist extends Document {
	_user: Schema.Types.ObjectId
	items?: IItems
	name: string
	isPublic: boolean
	isDeleted: boolean
}
const itemSchema = new Schema<IItems>({
	_products: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Product',
			default: undefined,
		},
	],
	_bundles: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Bundle',
			default: undefined,
		},
	],
},{_id:false})

const wishlistSchema = new Schema<IWishlist>(
	{
		_user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: itemSchema,
		isPublic: {
			type: Boolean,
			default: false,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			default: 'My Wishlist',
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)


export const Wishlist = model<IWishlist>('Wishlist', wishlistSchema)