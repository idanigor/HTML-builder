const fs = require('fs')
const fsPromises = require('fs/promises')
const { join } = require('path')
const pathDist = join(__dirname, 'project-dist', 'bundle.css')

fs.readdir(
	join(__dirname, 'styles'),
	{ withFileTypes: true },
	(error, files) => {
		fs.stat(pathDist, (error) => {
			if (!error) {
				fsPromises.unlink(pathDist)
			}
			files.forEach((file) => {
				if (file.isFile() && file.name.slice(-4) === '.css') {
					fs.readFile(
						join(__dirname, 'styles', file.name),
						'utf8',
						(err, data) => {
							fsPromises.appendFile(pathDist, data)
						}
					)
				}
			})
		})
	}
)
