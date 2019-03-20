'use strict'

//Responsavel pela Autenticação das Sessões.

class SessionController {
	async create ({ request, auth }){
		
		const { email, password } = request.all()
		
		//Pega Email e senha para gerar o token de Acesso.
		const token = await auth.attempt(email, password)
		
		return token
	}
}

module.exports = SessionController
