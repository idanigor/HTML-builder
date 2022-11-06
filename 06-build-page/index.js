const fs = require('fs')
const fsPromises = require('fs/promises')
const { join, parse } = require('path')
const pathProjectDist = join(__dirname, 'project-dist')
const pathStyleBundle = join(pathProjectDist, 'style.css')
const pathIndexBundle = join(pathProjectDist, 'index.html')

createAndDelete()

async function createAndDelete() {
	await fsPromises.mkdir(join(pathProjectDist), { recursive: true })
	await fsPromises.mkdir(join(pathProjectDist, 'assets'), {
		recursive: true,
	})
	fs.stat(pathStyleBundle, async (error) => {
		if (!error) {
			await fsPromises.unlink(pathStyleBundle)
		}
	})
	fs.stat(pathIndexBundle, async (error) => {
		if (!error) {
			await fsPromises.unlink(pathIndexBundle)
		}
	})
	getStyle()
}

async function getStyle() {
	const filesStyle = await fsPromises.readdir(join(__dirname, 'styles'), {
		withFileTypes: true,
	})

	filesStyle.forEach(async (file) => {
		if (file.isFile() && parse(file.name).ext === '.css') {
			const data = await fsPromises.readFile(
				join(__dirname, 'styles', file.name),
				'utf8'
			)
			await fsPromises.appendFile(pathStyleBundle, data)
		}
	})
	getAssets()
}

async function getAssets() {
	const pathAssets = join(__dirname, 'assets')
	const dirsAssets = await fsPromises.readdir(pathAssets)

	dirsAssets.forEach(async (dirs) => {
		await fsPromises.mkdir(join(pathProjectDist, 'assets', dirs), {
			recursive: true,
		})
		await fsPromises
			.readdir(join(pathProjectDist, 'assets', dirs))
			.then(async (data) => {
				if (data) {
					data.forEach(async (el) => {
						await fsPromises.unlink(join(pathProjectDist, 'assets', dirs, el))
					})
				}
			})

		const files = await fsPromises.readdir(join(pathAssets, dirs))
		files.forEach(async (file) => {
			await fsPromises.copyFile(
				join(pathAssets, dirs, file),
				join(pathProjectDist, 'assets', dirs, file)
			)
		})
	})
	getHTML()
}

async function getHTML() {
	await fsPromises.copyFile(join(__dirname, 'template.html'), pathIndexBundle)

	let text = await fsPromises.readFile(
		join(__dirname, 'template.html'),
		'utf-8'
	)
	const arrTags = text.match(/{{(.*)}}/g)

	arrTags.forEach(async (tag) => {
		const tagText = await fsPromises.readFile(
			join(__dirname, 'components', `${tag.slice(2, -2)}.html`),
			'utf-8'
		)
		text = text.replace(tag, tagText)
		if (tag === arrTags.at(-1)) {
			await fsPromises.writeFile(join(pathProjectDist, 'index.html'), text)
		}
	})
}
