import React, { Component, SyntheticEvent } from 'react';
import trim from 'lodash/trim';

type Option = {
  value: string;
  label: string;
};

type Props = {
  value?: string;
  options: Option[];
  placeholder?: string;
  notFoundText?: string;
  focused?: boolean;
  noInput?: boolean;
  arrow?: boolean;
  onSelect?: (arg0: any) => void;
};

type State = {
  value: string;
  selected: string;
  options: Option[];
  optionsValues: string[];
  optionsLabels: string[];
  optionsVisible: string[];
  placeholder: string;
  notFoundText: string;
  focused: boolean;
  preFocused: boolean;
  arrowPosition: number;
  noInput: boolean;
  arrow: boolean;
  assume?: string;
};

export default class Searchable extends Component {
  state: State;

  list: any;

  input: any;

  props!: Props;

  constructor(props: Props) {
    super(props);
    const value = props.value === '' || props.value ? props.value : false;
    this.state = {
      value,
      selected: value,
      options: props.options || [],
      optionsValues: props.options.map(option => {
        return option.value;
      }),
      optionsLabels: props.options.map(option => {
        return option.label;
      }),
      optionsVisible: [],
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      focused: false,
      preFocused: !!props.focused,
      arrowPosition: -1,
      noInput: props.noInput || false,
      arrow: props.arrow || false,
      assume: undefined
    } as State;
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.select = this.select.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.onBlur);
    this.findInitialValue();
  }

  findInitialValue() {
    const { value, options } = this.state;
    let match: boolean | Option = false;
    options.forEach(item => {
      if (!match) match = item.value === value ? item : false;
    });
    this.setState({
      value: match ? (match as Option).label : '',
      selected: match ? (match as Option).label : ''
    });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBlur);
  }

  static getDerivedStateFromProps(props: Props) {
    return {
      options: props.options || [],
      optionsValues: props.options.map(option => {
        return option.value;
      }),
      optionsLabels: props.options.map(option => {
        return option.label;
      }),
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      arrow: props.arrow || false
    };
  }

  sort() {
    let { value, optionsVisible } = this.state;
    let firsts = [];
    let seconds = [];
    if (value) {
      optionsVisible = optionsVisible.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      seconds = optionsVisible.filter(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
      firsts = seconds.filter(item => {
        return item.indexOf(value) === 0;
      });
      seconds = seconds.filter(item => {
        return item.indexOf(value) !== 0;
      });
      optionsVisible = optionsVisible.filter(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) !== 0;
      });
      optionsVisible = [...firsts, ...seconds, ...optionsVisible];
    }
    this.setState({
      optionsVisible
    });
  }

  findAssumption() {
    const { optionsVisible, value } = this.state;
    const assume = optionsVisible.find(item => {
      return item.indexOf(value) === 0;
    });
    const assumeLower = optionsVisible.find(item => {
      return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
    });
    if (!assume && !assumeLower) return;
    this.setState({
      assume: value ? assume || assumeLower : false
    });
  }

  buildList(value: string) {
    const { optionsLabels } = this.state;
    const optionsVisible = optionsLabels.filter(item => {
      return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
    this.setState(
      {
        value,
        optionsVisible,
        focused: true,
        assume: false,
        arrowPosition: -1
      },
      () => {
        this.sort();
        this.findAssumption();
      }
    );
  }

  onChange(e: SyntheticEvent) {
    const { value } = e.target as HTMLTextAreaElement;
    if (!this.select(value)) this.buildList(value);
  }

  keyDown(e: KeyboardEvent) {
    let { assume = '', arrowPosition, optionsVisible, value } = this.state;

    if ((e.keyCode === 9 || e.keyCode === 13) && assume) {
      e.preventDefault();
      this.select(assume);
    }

    if (e.keyCode === 40) {
      e.preventDefault();
      if (arrowPosition < optionsVisible.length - 1) {
        arrowPosition++;
      } else {
        arrowPosition = 0;
      }
      const assume = optionsVisible[arrowPosition];
      value = assume.slice(0, value.length);
      this.setState(
        {
          value,
          arrowPosition,
          assume
        },
        this.scrollList
      );
    }

    if (e.keyCode === 38) {
      e.preventDefault();
      if (arrowPosition <= 0) {
        arrowPosition = optionsVisible.length - 1;
      } else {
        arrowPosition--;
      }
      const assume = optionsVisible[arrowPosition];
      value = assume.slice(0, value.length);
      this.setState(
        {
          value,
          arrowPosition,
          assume
        },
        this.scrollList
      );
    }
  }

  scrollList() {
    const { list } = this;
    const { arrowPosition } = this.state;
    const target = `.searchable-list-item__${arrowPosition}`;
    if (list) {
      const item = list.querySelector(target);
      item && item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onFocus() {
    const { optionsLabels, optionsVisible } = this.state;
    this.input && this.input.focus();
    this.setState({
      focused: true,
      optionsVisible: optionsVisible.length ? optionsVisible : optionsLabels
    });
  }

  onBlur() {
    const { value, optionsLabels } = this.state;
    let match: boolean | string = false;
    optionsLabels.forEach(item => {
      if (!match)
        match = item.toLowerCase() === value.toLowerCase() ? item : false;
    });
    this.setState({
      focused: false,
      optionsVisible: [],
      value: match || '',
      assume: false,
      arrowPosition: -1
    });
  }

  select(value: string) {
    const { optionsLabels, options, selected } = this.state;
    let newSelected =
      optionsLabels.find(item => {
        return item === value;
      }) || '';
    const newSelectedLower =
      optionsLabels.find(item => {
        return item.toLowerCase() === value.toLowerCase();
      }) || '';
    newSelected = newSelected || newSelectedLower;
    this.setState(
      {
        selected: newSelected,
        value: newSelected || value,
        optionsVisible: [],
        focused: false,
        arrowPosition: -1,
        assume: false
      },
      () => {
        selected !== newSelected &&
          this.props.onSelect &&
          this.props.onSelect(
            options.find(item => {
              return item.label === newSelected;
            }) || false
          );
      }
    );
    return newSelected;
  }

  render() {
    const {
      value,
      optionsVisible,
      optionsLabels,
      focused,
      preFocused,
      placeholder,
      notFoundText,
      assume,
      arrowPosition,
      selected,
      noInput,
      arrow
    } = this.state;

    if (preFocused) {
      this.input && this.input.focus();
      this.state.focused = true;
      this.state.optionsVisible = optionsVisible.length
        ? optionsVisible
        : optionsLabels;
      this.state.preFocused = false;
    }

    return (
      <div
        className="searchable"
        onClick={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          const action = !noInput
            ? this.onFocus
            : focused
            ? this.onBlur
            : this.onFocus;
          action();
        }}
      >
        <div
          className={[
            'searchable-input',
            focused ? 'searchable-input__active' : ''
          ].join(' ')}
        >
          <input
            type="text"
            onChange={this.onChange}
            value={value}
            placeholder={!assume ? placeholder : ''}
            // @ts-ignore
            onKeyDown={this.keyDown}
            ref={node => (this.input = node)}
            readOnly={noInput}
          />
          {assume && (
            <span className="searchable-input-assume">
              {assume.split('').map((char, index) => {
                return (
                  <span
                    key={char + index}
                    className={[
                      'searchable-input-assume-char',
                      char === char.toUpperCase()
                        ? 'searchable-input-assume-char__upper'
                        : 'searchable-input-assume-char__lower',
                      index <= value.length - 1
                        ? 'searchable-input-assume-char__hidden'
                        : ''
                    ].join(' ')}
                  >
                    {index <= value.length - 1 ? value[index] : char}
                  </span>
                );
              })}
            </span>
          )}

          <div
            className="searchable-input-arrow"
            onClick={e => {
              if (focused) {
                e.stopPropagation();
                this.onBlur();
              }
            }}
          >
            {arrow || (
              <svg viewBox="0 0 330 330">
                <path
                  d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                />
              </svg>
            )}
          </div>
        </div>
        <div
          ref={node => (this.list = node)}
          className={[
            'searchable-list',
            focused ? 'searchable-list__visible' : ''
          ].join(' ')}
        >
          {optionsVisible.length ? (
            optionsVisible.map((item, index) => {
              console.log(item);
              return (
                <div
                  className={[
                    'searchable-list-item',
                    `searchable-list-item__${index}`,
                    item === selected ? 'searchable-list-item__active' : '',
                    arrowPosition >= 0 && index === arrowPosition
                      ? 'searchable-list-item__arrow-position'
                      : '',
                    item.startsWith('^') ? 'searchable-list-item-bold' : ''
                  ].join(' ')}
                  key={index}
                  onClick={e => {
                    e.stopPropagation();
                    this.select(item);
                  }}
                >
                  {arrowPosition >= 0 && index === arrowPosition && (
                    <i className="searchable-list-item-arrow">
                      <svg viewBox="0 0 240.823 240.823">
                        <path
                          d="M183.189,111.816L74.892,3.555c-4.752-4.74-12.451-4.74-17.215,0c-4.752,4.74-4.752,12.439,0,17.179
		l99.707,99.671l-99.695,99.671c-4.752,4.74-4.752,12.439,0,17.191c4.752,4.74,12.463,4.74,17.215,0l108.297-108.261
		C187.881,124.315,187.881,116.495,183.189,111.816z"
                        />
                      </svg>
                    </i>
                  )}
                  {trim(item, '^')}
                </div>
              );
            })
          ) : (
            <div className="searchable-list-empty">{notFoundText}</div>
          )}
        </div>
      </div>
    );
  }
}
