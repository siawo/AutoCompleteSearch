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
    selectIndex: -1,
    isSelectedValue: false
  };

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;

    const inputFn = (value) => {
      if (value) {
        const {
          params,
          relativePath,
          baseURL,
          searchParam,
          addString,
          dataAccessor
        } = this.props,
          urlParamSet = new URLSearchParams(params),
          urlObj = new URL(relativePath, baseURL),
          showList = true;

        urlParamSet.set(searchParam, value);
        urlObj.search = urlParamSet.toString();
        const url = urlObj.href + addString;
        let data = localStorage.getItem(url);
        if (data) {
          this.setState(() => ({
            value,
            list: JSON.parse(data),
            showList,
            selectIndex: -1
          }));
        } else {
          fetch(url, {
            header: {
              'Access-Control-Allow-Origin': '*'
            }
          })
            .then(response => response.json())
            .then(json => {
              const list = json.items.sort((item1, item2) =>
                String(dataAccessor(item1).localeCompare(String(dataAccessor(item2)))));
              localStorage.setItem(url, JSON.stringify(list));
              this.setState(() => ({
                value,
                list,
                showList,
                selectIndex: -1,
                isSelectedValue: false
              }));
            });
        }
      } else {
        this.setState(() => (DEFAULT_STATE));
      }
    },
      picker = ([e]) => [e.target.innerText];

    this.inputHandler = debounce(inputFn, DELAY, picker);

    this.blur = () => {
      this.setState(() => ({
        showList: false
      }));
    }
    this.focus = () => {
      this.setState(state => ({
        showList: !state.isSelectedValue && !!state.value
      }));
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
    const { list } = this.state,
      { dataAccessor } = this.props;
    if (index > -1 && index < list.length) {
      this.setState(() => ({
        value: dataAccessor(list[index]),
        showList: false,
        list: [],
        selectIndex: -1,
        isSelectedValue: true
      }))
    }
  }

  render() {
    const {
      showList,
      list,
      selectIndex,
      value
    } = this.state,
    {
      dataAccessor
    } = this.props;
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
              dataAccessor={dataAccessor}
            />
            : ''
        }
      </div>
    );
  }
}


export default App;
