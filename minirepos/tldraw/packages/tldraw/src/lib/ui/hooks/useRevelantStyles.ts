import {
	DefaultColorStyle,
	DefaultDashStyle,
	DefaultFillStyle,
	DefaultSizeStyle,
	ReadonlySharedStyleMap,
	SharedStyle,
	SharedStyleMap,
	useEditor,
	useValue,
} from '@tldraw/editor'

const selectToolStyles = [DefaultColorStyle, DefaultDashStyle, DefaultFillStyle, DefaultSizeStyle]

export function useRelevantStyles(): {
	styles: ReadonlySharedStyleMap
	opacity: SharedStyle<number>
} | null {
	const editor = useEditor()
	return useValue(
		'getRelevantStyles',
		() => {
			const styles = new SharedStyleMap(editor.sharedStyles)
			const hasShape = editor.selectedShapeIds.length > 0 || !!editor.root.current.value?.shapeType

			if (styles.size === 0 && editor.isIn('select') && editor.selectedShapeIds.length === 0) {
				for (const style of selectToolStyles) {
					styles.applyValue(style, editor.getStyleForNextShape(style))
				}
			}

			if (styles.size === 0 && !hasShape) return null
			return { styles, opacity: editor.sharedOpacity }
		},
		[editor]
	)
}
