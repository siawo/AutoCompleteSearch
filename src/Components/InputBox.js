import React from 'react';
import './InputBox.css';
export default props => {
	const {
		value,
		onInput,
		onKeyDown,
		onKeyUp,
		reset,
		fillValue = ''
	} = props;
	return (<div className='input'>
		<div className={value ? 'editable' : 'blankeditable'}
			suppressContentEditableWarning='true'
			contentEditable='true'
			onInput={onInput}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
		>
			{value}
		</div>
		<div className='fill'>
			{
				fillValue.slice(value.length)
			}
		</div>
		<div className={value ? 'cancel' : 'hide'} onClick={reset}>
			X
		</div>
	</div>);
}