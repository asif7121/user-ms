import { Schema, Document, model } from 'mongoose'


interface ICartItem extends Document {
	productId: Schema.Types.ObjectId
	productName: string
	productPrice: number
	quantity: number
	totalPrice: number // Calculated as productPrice * quantity
}


interface ICart extends Document {
	_user: Schema.Types.ObjectId
	items: ICartItem[]
	totalItems: number 
	totalCost: number 
}


const CartItemSchema = new Schema<ICartItem>(
	{
		productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
		productName: { type: String, required: true },
		productPrice: { type: Number, required: true },
		quantity: { type: Number, required: true },
		totalPrice: { type: Number, required: true },
	},
	{ _id: false }
) // _id: false prevents MongoDB from creating a separate ID for each item


const CartSchema = new Schema<ICart>(
	{
		_user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
		items: [CartItemSchema],
		totalItems: {
			type: Number,
			required: true,
			default: 0,
			// Automatically calculates the total number of items in the cart
			get: function () {
				return this.items.reduce((sum, item) => sum + item.quantity, 0)
			},
		},
		totalCost: {
			type: Number,
			required: true,
			default: 0,
			// Automatically calculates the total cost of items in the cart
			get: function () {
				return this.items.reduce((sum, item) => sum + item.totalPrice, 0)
			},
		},
	},
	{
		timestamps: true,
		toJSON: { getters: true },
        toObject: { getters: true },
        versionKey:false
	}
)

export const Cart = model<ICart>('Cart', CartSchema)
