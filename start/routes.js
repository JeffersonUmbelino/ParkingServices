'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use('Route')

// cria a rota do usuario para POST em /users.
Route.post('/users','UserController.create')


Route.post('/sessions', 'SessionController.create')

//cria a rota para todos os metodos de listagem, exibição, edição e remoção
Route.resource('parkings','ParkingController')
	 .apiOnly() //metodo excluido create e edit não tenham rotas.
	// .middleware('auth') //apenas usuarios autenticados podem usar a rota.

Route.post('parkings/:id/images', 'ImageController.store')
	 .middleware('auth')

Route.get('images/:path', 'ImageController.show')




