'use strict'
const User = use('App/Models/User')
const API = use('App/Services/Api')
const Env = use('Env')
const UserNotFoundExeception = use('App/Exceptions/UserNotFoundException')

class AuthController {

    async exist(phone){
        try {
            //Retrive use based on form data
            const user = await User.query().where('phone', phone).first()

            if (user.is_active === 1) {
                return true
            }

            return  'inactive'

        } catch (error) {
            return false
            //throw new UserNotFoundExeception()
        }
    }

    async getcode({ request, response }){
        const phone = request.input('phone').replace(/[{()}]/g, '')
        const Http = await API.verifyRequest()
        const url = Env.get('VERIFY_APP_KEY') + '/code/sms?app_key=' + Env.get('VERIFY_APP_KEY') + '&api_key=' + Env.get('VERIFY_APP_API_KEY') + '&phone='+phone+'&service=SMS'
        const exist = await this.exist(phone)

        if (exist === true) {
            await Http.post(url).then((res) => {
                return response.status(200).json(res.data)
            }).catch((err) => {
                return response.json(err)
            })
        }

        if (exist === 'inactive') {
            return response.status(401).json({
                status: 'Error',
                message: 'Account not active'
            })
        }

        if (!exist) {
            throw new UserNotFoundExeception()
        }

    }

    async verify({ request, response, auth }){
        const { phone , code, token } = request.all()
        const Http = await API.verifyRequest()
        const url = Env.get('VERIFY_APP_KEY') + '/verify?app_key=' + Env.get('VERIFY_APP_KEY') + '&api_key=' + Env.get('VERIFY_APP_API_KEY') + '&phone=' + phone + '&code=' + code + '&token=' + token

        const res = await Http.post(url)
        
        const status = await res.status

        if(status == 200){
            if (res.data.status == 'ERROR') {
                return response.status(401).json(res.data)
            }

            if (res.data.status == 'SUCCESS') {

                const user = await User.query().where('phone', res.data.phone).first()

                user.pin = code.toString()

                await user.save()

                const verified = await this.verified(res.data.phone, code, auth)

                if (verified.success) {
                    return response.status(200).json(verified)
                } else {
                    return response.status(400).json(verified)
                }
            }
        }
    }

    async verified(phone, pin, auth) {

        try {
            const token = await auth.attempt(phone, pin)
            return {
                success: true,
                token: token
            }
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Login failed, Please try again later!'
            }
        }
    }

    async login({ request, response, auth }){
        
        try {
            const {phone, pin} = request.all()
            //Retrive use based on form data
            const user = await User.query().where('phone', phone).first()

            if (user.is_active === 1) {
                try {
                    const token = await auth.attempt(phone, pin)
                    return response.status(200).json({
                        token: token
                    })
                } catch (error) {
                    console.log(error)
                    return response.status(404).json({
                        message: error
                    })
                }
            }

            return response.status(401).json({
                message: 'Account not active'
            })

        } catch (error) {
            throw new UserNotFoundExeception()
        }
    }
}

module.exports = AuthController
