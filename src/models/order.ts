import { Schema, Document, model } from 'mongoose'

// Define interfaces for TypeScript
interface IOrderProduct {
	productId: Schema.Types.ObjectId
	productName: string
	quantity: number
	productPrice: number
}

interface Iaddress {
	street: string
	area: string
	city: string
	zipcode: string
	state: string
	country: string
}

interface IOrder extends Document {
	_user: Schema.Types.ObjectId
	products: IOrderProduct[]
	totalAmount: number
	shippingAddress: Iaddress
	paymentMethod: 'Credit Card' | 'Debit Card'| 'COD'
	paymentStatus: 'Pending' | 'Completed' | 'Failed' | 'Refunded'
	orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'
	orderDate: Date
	deliveryDate?: Date
	isDeleted: boolean
}

// Define the schema
const OrderSchema: Schema<IOrder> = new Schema(
	{
		_user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		products: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					required: true,
				},
				productName: {
					type: String,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					default: 1,
					min: 1,
				},
				productPrice: {
					type: Number,
					required: true,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			default: 0,
		},
		shippingAddress:
			{
				street: {
					type: String,
				},
				area: {
					type: String,
				},
				city: {
					type: String,
				},
				zipcode: {
					type: String,
				},
				state: {
					type: String,
				},
				country: {
					type: String,
				},
			},
		paymentMethod: {
			type: String,
			enum: ['Credit Card', 'Debit Card', 'COD'],
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
			default: 'Pending',
			required: true,
		},
		orderStatus: {
			type: String,
			enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
			default: 'Processing',
			required: true,
		},
		orderDate: {
			type: Date,
			default: Date.now,
			required: true,
		},
		deliveryDate: {
			type: Date,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
    {
        timestamps: true,
        versionKey: false
     }
)

// Export the model
export const Order = model<IOrder>('Order', OrderSchema)
