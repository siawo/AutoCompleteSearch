import React from 'react';
import './List.css';

export default props => {
	const { 
		list,
		 selectIndex,
			listLength,
			dataAccessor,
			mouseOver
		 } = props
	return <div className='list'>
		{
			list.length
				? list
					.slice(0, listLength)
					.map((datum, i) => {
						const value = dataAccessor(datum);
						return (<div 
							className={'item' + (i === selectIndex ? ' selected' : '')}
							 key={i}
							 onMouseOver={() => mouseOver(i)}
							 >{value}</div>);
					})
				: <div className='no_result'>No Results</div>
		}
	</div>
}