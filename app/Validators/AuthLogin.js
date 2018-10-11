'use strict'

class AuthLogin {
  get rules () {
    return {
      // validation rules
      'phone': 'required',
      'pin': 'required'
    }
  }

  get messages() {
    return {
      //validation messages
      'phone.required': 'Phone Number is required.',
      'pin.required': 'Enter your PIN code'
    }
  }
}

module.exports = AuthLogin
