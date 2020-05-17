import React from 'react';
import './AutoBox.css';
import List from './List.js';
import InputBox from './InputBox.js';
import debounce from '../utils/debounce.js';
import placeCaret from '../utils/placecaret.js';

const DELAY = 500,
  UP_ARROW_CODE = 38,
  DOWN_ARROW_CODE = 40,
  DEFAULT_STATE = {
    value: '',
    showList: false,
    list: [],
    selectIndex: -1
  };

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

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
          this.setState(() => ({ value, list: JSON.parse(data), showList, selectIndex: -1 }));
        } else {
          fetch(url, {
            header: {
              'Access-Control-Allow-Origin': '*'
            }
          })
            .then(response => response.json())
            .then(json => {
              const list = json.items.sort()
              localStorage.setItem(url, JSON.stringify(list));
              this.setState(() => ({ value, list, showList, selectIndex: -1 }));
            });
        }
      } else {
        this.setState(() => (DEFAULT_STATE));
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

    this.keyDown = e => {
      const keyCode = e.keyCode;
      let { selectIndex, list, showList } = this.state;
      if (keyCode === 13) {
        e.preventDefault();
        this.updateValueByIndex(selectIndex)
        return;
      }
      if ([UP_ARROW_CODE, DOWN_ARROW_CODE].includes(keyCode) && list.length && showList) {
        const maxVal = Math.min(this.props.listLength, list.length);
        if (keyCode === UP_ARROW_CODE) {
          selectIndex = (maxVal + selectIndex - (selectIndex === -1 ? 0 : 1)) % maxVal;
        } else if (keyCode === DOWN_ARROW_CODE) {
          selectIndex = (maxVal + selectIndex + 1) % maxVal;
        }
        e.preventDefault();
        this.setState(() => ({ selectIndex }));
      }
    }

    this.keyUp = e => placeCaret(e.target, false);
  }

  updateValueByIndex(index) {
    const { list } = this.state;
    if (index > -1 && index < list.length) {
      this.setState(() => ({ value: list[index].login, showList: false, list: [], selectIndex: -1 }))
    }
  }

  render() {
    const {
      showList,
      list,
      selectIndex,
      value
    } = this.state;
    return (
      <div className='container' onBlur={this.blur} onFocus={this.focus}>
        <InputBox 
        value={value} 
        onInput={this.inputHandler}
        onKeyDown={this.keyDown}
        onKeyUp={this.keyUp}
        />
        {
          showList
            ? <List
              list={list}
              selectIndex={selectIndex}
              listLength={this.props.listLength}
            />
            : ''
        }
      </div>
    );
  }
}


export default App;
