'use strict'

const Helpers = use('Helpers')

const Image = use('App/Models/Image')
const Parking = use('App/Models/Parking')



class ImageController {

	async show({params, response}){
		
		return response.download(Helpers.tmpPath(`uploads/${params.path}`))
		
	}

	async store( {params, request} ){

		//Busca a imagem pelo id
		const parking = await Parking.findOrFail(params.id)

		
		const images = request.file('image', {
			types: ['image'],
			size: '5mb'
		})

	
		//Move as imagens para a pasta tem/uploads
	await images.moveAll(Helpers.tmpPath('uploads'), file => ({

		name: `${Date.now()}-${file.clientName}`

	}))

	if (!images.moveAll()) {
		return images.erros()
	}

	//cria os registros de imagens no banco.
	await Promise.all(
		
		images
			.movedList()
			.map(image => parking.images().create({path: image.fileName}))

		)

	}



}

module.exports = ImageController
