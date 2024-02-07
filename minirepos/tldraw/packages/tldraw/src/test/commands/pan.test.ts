import { Box2d, Vec2d } from '@tldraw/editor'
import { TestEditor, createDefaultShapes } from '../TestEditor'

let editor: TestEditor

beforeEach(() => {
	editor = new TestEditor()
	editor.createShapes(createDefaultShapes())
})

describe('When panning', () => {
	it('Updates the camera', () => {
		editor.pan({ x: 200, y: 200 })
		editor.expectCameraToBe(200, 200, 1)
	})

	it('Updates the pageBounds', () => {
		const screenBounds = editor.viewportScreenBounds
		const beforeScreenBounds = new Box2d(
			screenBounds.x,
			screenBounds.y,
			screenBounds.w,
			screenBounds.h
		)
		const beforePageBounds = editor.viewportPageBounds.clone()
		editor.pan({ x: 200, y: 200 })
		expect(editor.viewportScreenBounds).toMatchObject(beforeScreenBounds.toJson())
		expect(editor.viewportPageBounds.toJson()).toMatchObject(
			beforePageBounds.translate(new Vec2d(-200, -200)).toJson()
		)
	})
})
