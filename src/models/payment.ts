import { Schema, Document, model } from 'mongoose'

export interface IPayment extends Document {
	_user: Schema.Types.ObjectId
	orderId: Schema.Types.ObjectId
	amount: number
	currency: string
	status: 'pending' | 'succeeded' | 'failed'
	paymentIntentId: string
	paymentMethod: string
	createdAt: Date
}

const PaymentSchema: Schema<IPayment> = new Schema(
	{
		_user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Order',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		currency: {
			type: String,
			required: true,
			default: 'usd',
		},
		status: {
			type: String,
			enum: ['pending', 'succeeded', 'failed'],
			default: 'pending',
		},
		paymentIntentId: {
			type: String,
			required: true,
		},
		paymentMethod: {
			type: String,
			enum: ['Credit Card', 'Debit Card'],
			required: true,
		},
	},
	{
        timestamps: true,
        versionKey:false
	}
)

export const Payment = model<IPayment>('Payment', PaymentSchema)
