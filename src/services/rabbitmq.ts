import amqp from 'amqplib'

const QUEUE_NAME = 'auth_queue'

export const connectRabbitMQ = async () => {
	try {
		const connection = await amqp.connect('amqp://localhost')
		const channel = await connection.createChannel()
		await channel.assertQueue(QUEUE_NAME, { durable: true })

		channel.consume(QUEUE_NAME, (msg) => {
			if (msg) {
				const message = msg.content.toString()
				console.log('Received message:', message)
				// Process the message
				channel.ack(msg)
			}
		})

		console.log('RabbitMQ connected and consuming')
	} catch (error) {
		console.error('RabbitMQ connection error:', error)
	}
}
