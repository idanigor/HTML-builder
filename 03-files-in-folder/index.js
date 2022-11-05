const fs = require('fs')
const path = require('path')

fs.readdir(
	path.join(__dirname, 'secret-folder'),
	{ withFileTypes: true },
	(error, files) => {
		files.forEach((element) => {
			if (element.isFile()) {
				fs.stat(
					path.join(__dirname, 'secret-folder', element.name),
					(err, stats) => {
						const nameFile = element.name.split('.')[0]
						const extFile = path.extname(element.name).slice(1)
						const size = `${stats.size / 1000}kb`
						console.log(`${nameFile} - ${extFile} - ${size}`)
					}
				)
			}
		})
	}
)
