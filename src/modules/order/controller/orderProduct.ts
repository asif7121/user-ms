import { Request, Response } from 'express'
import { Order } from '@models/order'
import { Product } from '@models/product'
import { Bundle } from '@models/bundle'
import moment from 'moment'
import { User } from '@models/user'

export const orderProduct = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user
		const { quantity, shippingAddress, paymentMethod } = req.body
		const { productId, bundleId } = req.query

		const user = await User.findById(_id)

		if (!productId && !bundleId) {
			return res.status(400).json({ error: 'No products or bundles selected for the order.' })
		}
		if (quantity) {
			if (isNaN(quantity) || quantity <= 0) {
				return res.status(400).json({
					error: 'Provide quantity value, that must be a number greater than 0',
				})
			}
		}
		// Validate shipping address
		if (!user.address?.length && !shippingAddress) {
			return res.status(400).json({ error: 'Shipping address is required.' })
		}
		// If a new shipping address is provided, check if it's the same as an existing address
		let isAddressUnique = true
		if (shippingAddress) {
			for (const address of user.address) {
				if (
					address.street === shippingAddress.street &&
					address.area === shippingAddress.area &&
					address.city === shippingAddress.city &&
					address.zipcode === shippingAddress.zipcode &&
					address.state === shippingAddress.state &&
					address.country === shippingAddress.country
				) {
					isAddressUnique = false
					break
				}
			}

			// If the shipping address is unique, add it to the user's address array
			if (isAddressUnique) {
				user.address.push(shippingAddress)
				await user.save() // Save the updated user with the new address
			}
		}
		const validPaymentMethods = ['Credit Card', 'Debit Card', 'COD']

		if (!validPaymentMethods.includes(paymentMethod)) {
			return res.status(400).json({ error: 'Invalid payment method.' })
		}

		let products = []
		let totalAmount = 0

		if (productId) {
			// Fetch the product details
			const product = await Product.findById(productId)
			if (!product) {
				return res.status(404).json({ error: 'Product not found.' })
			}

			// Calculate the total amount based on the quantity
			totalAmount = product.price * (quantity || 1)

			// Prepare the product information for the order
			products.push({
				productId: product._id,
				productName: product.name,
				quantity: quantity || 1,
				productPrice: product.price,
			})
		} else if (bundleId) {
			// Fetch the bundle details
			const bundle = await Bundle.findById(bundleId)
			if (!bundle) {
				return res.status(404).json({ error: 'Bundle not found.' })
			}

			totalAmount = bundle.price * (quantity || 1)
			products.push({
				productId: bundle._id,
				productName: bundle.name,
				quantity: quantity,
				productPrice: bundle.price,
			})
		}
		const now = moment()
		const format = 'DD-MM-YYYY HH-mm-ss'
		const orderTime = moment(now, format, true)
		// Calculate delivery date, two weeks after the order date
		const deliveryDate = moment(orderTime).add(2, 'weeks')
		// Create a new order
		const newOrder = new Order({
			_user: _id,
			products: products,
			totalAmount: totalAmount,
			shippingAddress: shippingAddress || user.address[0],
			paymentMethod,
			orderDate: orderTime.toDate(),
			deliveryDate: deliveryDate.toDate()
		})

		// Save the order to the database
		await newOrder.save()

		// Return success response with order details
		return res.status(201).json({
			success: true,
			message: 'Order placed successfully.',
			data: newOrder,
		})
	} catch (error) {
		console.error(error)
		return res.status(500).json({ error: error.message })
	}
}
