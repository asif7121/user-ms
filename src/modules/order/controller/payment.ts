import { Request, Response } from 'express'
import Stripe from 'stripe'
import { Payment } from '@models/payment'
import { Order } from '@models/order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2024-06-20',
})

export const createPaymentIntent = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.query

		// Fetch the order details
		const order = await Order.findById(orderId)
		if (!order) {
			return res.status(404).json({ error: 'Order not found.' })
		}

		// Create a payment intent
		const paymentIntent = await stripe.paymentIntents.create({
			amount: order.totalAmount * 100, // Stripe expects amount in cents
			currency: 'usd',
			payment_method_types: ['card'],
		})

		// Save payment details in the database
		const newPayment = new Payment({
			_user: order._user,
			orderId: order._id,
			amount: order.totalAmount,
			currency: 'usd',
			status: 'pending',
			paymentIntentId: paymentIntent.id,
			paymentMethod: order.paymentMethod,
		})
		await newPayment.save()

		// Return secret for the payment
		return res.status(200).json({
			success: true,
			clientSecret: paymentIntent.client_secret,
			paymentId: newPayment._id,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
