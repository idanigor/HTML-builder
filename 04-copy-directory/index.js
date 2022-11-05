const fs = require('fs')
const fsPromises = require('fs/promises')
const { join } = require('path')
const pathCopy = join(__dirname, 'files-copy')
const copyDir = () => {
	fs.stat(pathCopy, (error) => {
		if (!error) {
			fs.readdir(pathCopy, (err, files) => {
				files.forEach((file) => {
					fsPromises.unlink(join(__dirname, 'files-copy', file))
				})
			})
		}
		fs.mkdir(pathCopy, () => {
			fs.readdir(
				join(__dirname, 'files'),
				{ withFileTypes: true },
				(err, files) => {
					files.forEach((file) => {
						if (file.isFile()) {
							fsPromises.copyFile(
								join(__dirname, 'files', file.name),
								join(__dirname, 'files-copy', file.name)
							)
						} else {
							console.log(
								'В папку files добавлена папка. В задании нет требования копировать папки и рекурсивно копировать их вложения'
							)
						}
					})
				}
			)
		})
	})
}
copyDir()
