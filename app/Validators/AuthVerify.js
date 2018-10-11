'use strict'

class AuthVerify {
  get rules () {
    return {
      // validation rules
      'code': 'required'
    }
  }

  get messages() { 
    return {
      //validation messages
      'code.required': 'Enter PIN code.'
    }
  }
}

module.exports = AuthVerify