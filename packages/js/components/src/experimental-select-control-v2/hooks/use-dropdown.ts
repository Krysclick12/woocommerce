/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	DefaultItem,
	getItemLabelType,
	getItemValueType,
	Selected,
} from '../types';
import { useCombobox } from './use-combobox';
import { useItem } from './use-item';
import { useFilter } from './use-filter';
import { useListbox } from './use-listbox';
import { useSelection } from './use-selection';

type useDropdownProps< Item > = {
	getItemLabel: getItemLabelType< Item >;
	getItemValue?: getItemValueType< Item >;
	initialSelected?: Item | Item[];
	multiple?: boolean;
	onDeselect?: ( item: Item ) => void;
	options: Item[];
	onSelect?: ( item: Item ) => void;
	selected: Selected< Item >;
};

export function useDropdown< Item = DefaultItem >( {
	getItemLabel,
	multiple = false,
	options,
	onDeselect,
	onSelect,
	selected,
}: useDropdownProps< Item > ) {
	const [ inputValue, setInputValue ] = useState< string >( '' );
	const [ isFocused, setIsFocused ] = useState( false );

	const { deselectItem, selectItem } = useSelection( {
		getItemLabel,
		multiple,
		options,
		onDeselect,
		onSelect,
		selected,
		setInputValue,
	} );

	const { filteredOptions } = useFilter< Item >( {
		getItemLabel,
		inputValue,
		options,
		selected,
	} );
	const {
		close: closeListbox,
		props: listboxProps,
		highlightedOption,
		highlightNextOption,
		highlightPreviousOption,
		setHighlightedIndex,
		isOpen: isListboxOpen,
		open: openListbox,
	} = useListbox< Item >( {
		multiple,
		options: filteredOptions,
	} );
	const comboboxProps = useCombobox< Item >( {
		closeListbox,
		highlightedOption,
		highlightNextOption,
		highlightPreviousOption,
		inputValue,
		openListbox,
		selectItem,
		setInputValue,
		onInputBlur: () => setIsFocused( false ),
		onInputFocus: () => setIsFocused( true ),
	} );
	const { getItemProps } = useItem< Item >( {
		deselectItem,
		highlightedOption,
		multiple,
		selected,
		selectItem,
		onMouseOver: ( e, item ) => {
			if ( filteredOptions.indexOf( item ) !== -1 ) {
				setHighlightedIndex( filteredOptions.indexOf( item ) );
			}
		},
	} );

	return {
		comboboxProps,
		filteredOptions,
		getItemProps,
		inputValue,
		isListboxOpen,
		listboxProps,
		selected,
		isFocused,
		selectItem,
		deselectItem,
		setInputValue,
	};
}
