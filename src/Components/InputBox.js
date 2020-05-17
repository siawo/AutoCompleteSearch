import React from 'react';
export default props => {
	const { value, onInput, onKeyDown, onKeyUp } = props;
	return (<div className='input'>
		<div className='editable'
			suppressContentEditableWarning='true'
			contentEditable='true'
			onInput={onInput}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
		>
			{value}
		</div>
		<div className='fill'>
		</div>
		<div className='cancel'>

		</div>
	</div>);
}