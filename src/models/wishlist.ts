import { Document, model, Schema } from "mongoose";


interface IItems extends Document {
	productId: Schema.Types.ObjectId
	productName: string
	productPrice: number
}

interface IWishlist extends Document {
	_user: Schema.Types.ObjectId
	items?: [IItems]
	name: string
	isPublic: boolean
}
const itemSchema = new Schema<IItems>(
	{
		productId: { type: Schema.Types.ObjectId },
		productName: { type: String },
		productPrice: { type: Number },
	},
	{ _id: false }
)

const wishlistSchema = new Schema<IWishlist>(
	{
		_user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		items: [itemSchema],
		isPublic: {
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