import React from 'react';
import './AutoBox.css';
import debounce from '../utils/debounce.js';
import placeCaret from '../utils/placecaret.js';

const DELAY = 500,
  UP_ARROW_CODE = 38,
  DOWN_ARROW_CODE = 38;

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      showList: false,
      list: [],
      selectIndex: -1
    };

    const inputFn = (value) => {
      if (value) {
        const { props } = this,
          urlParamSet = new URLSearchParams(props.params),
          urlObj = new URL(props.relativePath, props.baseURL),
          showList = true;

        urlParamSet.set(props.searchParam, value);
        urlObj.search = urlParamSet.toString();
        const url = urlObj.href + props.addString;
        let data = localStorage.getItem(url);
        if (data) {
          this.setState(() => ({ value, list: JSON.parse(data), showList }));
        } else {
          fetch(url, { header: {
            'Access-Control-Allow-Origin': '*'
          } })
            .then(response => response.json())
            .then(json => {
              const list = json.items.sort()
              localStorage.setItem(url, JSON.stringify(list));
              this.setState(() => ({ value, list, showList }));
            });
        }
      } else {
        this.setState(() => ({ value, list: [], showList: false }))
      }
    },
      picker = ([e]) => [e.target.innerText];

    this.inputHandler = debounce(inputFn, DELAY, picker);

    this.blur = () => {
      this.setState(() => ({ showList: false }));
    }
    this.focus = () => {
      this.setState(state => ({ showList: !!state.value }));
    }

    this.selection =  e => {
      const keyCode = e.keyCode;
      if (keyCode === 13) {
        e.preventDefault();
        return;
      }
  
      let { selectIndex, list, showList } = this.state;
      if ([UP_ARROW_CODE, DOWN_ARROW_CODE].includes(keyCode) && list.length && showList) {
        const maxVal = Math.min(this.props.listLength, list.length)
        if (keyCode === UP_ARROW_CODE) {
          selectIndex = (maxVal + selectIndex - 1) % maxVal;
        } else if (keyCode === DOWN_ARROW_CODE) {
          selectIndex = (maxVal + selectIndex + 1) % maxVal;
        }
        this.setState(() => ({selectIndex}));
      }
    }
  }

  renderList() {
    const { list, showList } = this.state;

    return showList
    ? <div className='list'>
      {
        list.length
          ? list.slice(0, this.props.listLength).map(({ login }, i) => (<div className='item' key={i}>{login}</div>))
          : <div className='no_result'>No Results</div>
      }
    </div>
    : ''
  }

  render() {
    return (
      <div className='container' onBlur={this.blur} onFocus={this.focus}>
        <div className='input'>
          <div className='editable' contentEditable='true' onInput={this.inputHandler} onKeyDown={this.selection} onKeyUp={e => placeCaret(e.target, false)}>
            {this.state.value}
          </div>
          <div className='fill'>
          </div>
          <div className='cancel'>

          </div>
        </div>
        {
          this.renderList()
        }
      </div>
    );
  }
}


export default App;
