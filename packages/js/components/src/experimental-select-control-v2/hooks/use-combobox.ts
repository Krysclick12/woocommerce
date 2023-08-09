/**
 * External dependencies
 */
import { ChangeEvent, KeyboardEvent } from 'react';

/**
 * Internal dependencies
 */
import { DefaultItem } from '../types';

type useComboboxProps< Item > = {
	closeListbox: () => void;
	openListbox: () => void;
	highlightedOption: Item | null;
	highlightNextOption: () => void;
	highlightPreviousOption: () => void;
	inputValue: string;
	selectItem: ( item: Item ) => void;
	setInputValue: ( value: string ) => void;
	onInputFocus?: () => void;
	onInputBlur?: () => void;
};

export function useCombobox< Item = DefaultItem >( {
	closeListbox,
	highlightedOption,
	highlightNextOption,
	highlightPreviousOption,
	inputValue,
	openListbox,
	selectItem,
	setInputValue,
	onInputBlur = () => {},
	onInputFocus = () => {},
}: useComboboxProps< Item > ) {
	function onKeyDown( event: KeyboardEvent< HTMLInputElement > ) {
		switch ( event.key ) {
			case 'ArrowDown':
				openListbox();
				highlightNextOption();
				break;
			case 'ArrowUp':
				openListbox();
				highlightPreviousOption();
				break;
			case 'Enter':
				if ( highlightedOption ) {
					selectItem( highlightedOption );
				}
				break;
			case 'Escape':
				setInputValue( '' );
				closeListbox();
				break;
			default:
				openListbox();
		}
	}

	return {
		'aria-autocomplete': 'list',
		'aria-controls': 'menu-id', //@todo
		'aria-expanded': 'true', // @todo
		'aria-haspopup': 'true',
		'aria-labelledby': 'label-id', //@todo
		onBlur: () => {
			onInputBlur();
			closeListbox();
		},
		onChange: ( event: ChangeEvent< HTMLInputElement > ) =>
			setInputValue( event.target?.value ),
		onFocus: () => {
			onInputFocus();
			openListbox();
		},
		onKeyDown,
		role: 'combobox',
		value: inputValue,
	};
}
