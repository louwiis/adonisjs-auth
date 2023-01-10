import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import StoreUserValidator from 'App/Validators/Auth/StoreUserValidator'
import LoginValidator from 'App/Validators/Auth/LoginValidator'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const payload = await request.validate(StoreUserValidator)

    const user = await User.create(payload)

    return response.created({ user })
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)

    const token = await auth.attempt(email, password)
    const user = auth.user!

    return response.ok({
      token,
      ...user.serialize(),
    })
  }

  public async me({ auth, response }: HttpContextContract) {
    const user = auth.user!

    return response.ok({ ...user.serialize() })
  }
}
