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
	items?: ICartItem[]
	totalItems: number 
	totalCost: number 
}


const CartItemSchema = new Schema<ICartItem>(
	{
		productId: { type: Schema.Types.ObjectId},
		productName: { type: String},
		productPrice: { type: Number},
		quantity: { type: Number},
		totalPrice: { type: Number},
	},
	{ _id: false }
) 


const CartSchema = new Schema<ICart>(
	{
		_user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User'
		},
		items: [CartItemSchema],
		totalItems: {
			type: Number,
			default: 0,
		},
		totalCost: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
        versionKey:false
	}
)
CartSchema.pre('save', function (next) {
	this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0)
	this.totalCost = this.items.reduce((sum, item) => sum + item.totalPrice, 0)
	next()
})
export const Cart = model<ICart>('Cart', CartSchema)
