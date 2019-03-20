'use strict'

//Responsavel por recer os dados para criação do usuario.

//Importa o Modulo do Usuario.
const User = use("App/Models/User")

class UserController {
	
	async create({request}){
		
		//busca os campos na requisição.
		const data = request.only(["username", "email", "password"])
		
		// cria o usuario com os dados recebidos.
		const user = await User.create(data)
		
		return user
	}
	
}

module.exports = UserController
