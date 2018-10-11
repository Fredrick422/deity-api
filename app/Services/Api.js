'use strict'
const Env = use('Env')
const axios = use('axios')

class API {
    //verify phone number
    async verifyRequest() {
        return axios.create({ 
            baseURL: Env.get('VERIFY_APP_URL'),
            timeout: 10000,
            headers: { 'Content-Type': 'application/x-www-url-encoded; charset=utf-8' }
        });
    }

}

module.exports = new API()