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
			fs.readdir(join(__dirname, 'files'), (err, files) => {
				files.forEach((file) => {
					fsPromises.copyFile(
						join(__dirname, 'files', file),
						join(__dirname, 'files-copy', file)
					)
				})
			})
		})
	})
}
copyDir()
