import React from 'react';
import './List.css';

export default props => {
	const { list, selectIndex, listLength } = props
	return <div className='list'>
		{
			list.length
				? list
					.slice(0, listLength)
					.map(({ login }, i) =>
					 (<div className={'item' + (i === selectIndex ? ' selected' : '')} key={i}>{login}</div>))
				: <div className='no_result'>No Results</div>
		}
	</div>
}