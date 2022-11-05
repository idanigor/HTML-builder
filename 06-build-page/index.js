const fs = require('fs')
const fsPromises = require('fs/promises')
const { join, parse } = require('path')
const pathStyleBundle = join(__dirname, 'project-dist', 'style.css')
const pathIndexBundle = join(__dirname, 'project-dist', 'index.html')

fsPromises.mkdir(join(__dirname, 'project-dist'), { recursive: true })
fsPromises.mkdir(join(__dirname, 'project-dist', 'assets'), { recursive: true })

async function getBundle() {

	// await fsPromises.stat(pathStyleBundle, async (error) => {
	// 	if (!error) {
	// 		await fsPromises.unlink(pathStyleBundle)
	// 	}
	// })

	// await fsPromises.stat(pathIndexBundle, async (error) => {
	// 	if (!error) {
	// 		await fsPromises.unlink(pathIndexBundle)
	// 	}
	// })

	await fsPromises.copyFile(join(__dirname, 'template.html'), pathIndexBundle)

	const filesStyle = await fsPromises.readdir(join(__dirname, 'styles'), {
		withFileTypes: true,
	})

	filesStyle.forEach(async (file) => {
		if (file.isFile() && parse(file.name).ext === '.css') {
			const data = await fsPromises.readFile(
				join(__dirname, 'styles', file.name),
				'utf8'
			)
			fsPromises.appendFile(pathStyleBundle, data)
		}
	})

	const dirsAssets = await fsPromises.readdir(join(__dirname, 'assets'))

	dirsAssets.forEach(async (dirs) => {
		fsPromises.mkdir(join(__dirname, 'project-dist', 'assets', dirs), {
			recursive: true,
		})
		await fsPromises
			.readdir(join(__dirname, 'project-dist', 'assets', dirs))
			.then(async (data) => {
				if (data) {
					data.forEach(async (el) => {
						await fsPromises.unlink(
							join(__dirname, 'project-dist', 'assets', dirs, el)
						)
					})
				}
			})

		const files = await fsPromises.readdir(join(__dirname, 'assets', dirs))
		files.forEach(async (file) => {
			await fsPromises.copyFile(
				join(__dirname, 'assets', dirs, file),
				join(__dirname, 'project-dist', 'assets', dirs, file)
			)
		})
	})
}

getBundle()
