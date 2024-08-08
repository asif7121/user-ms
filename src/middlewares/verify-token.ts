import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { User } from '@models/user'




export const verify_token = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.headers?.authorization?.split(' ')[1]
		if (!token) {
			return res.status(400).json({ error: 'Invalid token' })
		}
		const decode:any = jwt.verify(token, process.env.JWT_SECRET) 
		const user = await User.findById(decode?._id).lean()
		if (!user) {
			return res.status(400).json({ error: 'Invalid user' })
		}
		if (user.role !== 'user') {
			return res.status(401).json({error:'Unauthorized access.'})
		}
		req.user = user
		next()
	} catch (error) {
		console.log('something went wront while verifing the token', error)
		res.status(500).json({ error: error.message })
	}
}
