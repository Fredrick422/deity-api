'use strict'

class AuthCode {
  get rules () {
    return {
      // validation rules
      'phone': 'required'
    }
  }

  get messages() { 
    return {
      //validation messages
      'phone.required': 'Phone Number is required.'
    }
  }
}

module.exports = AuthCode