import createElement from './createElement';
import render from './render';
import Component from './component';

const React = { createElement, Component };
const ReactDOM = { render };

const arr = ['no1', 'no2', 'no3'];

class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  render() {
    return (
      <div
        className="bg"
        onClick={() => {
          console.log('click');
          this.setState({
            number: this.state.number + 1,
          });
        }}
      >
        <h1>{this.state.number}</h1>
        {this.props.name}
        <div>{this.props.children}</div>
        <div>
          {this.props.arr &&
            this.props.arr.map(no => (
              <div style={{ fontWeight: 'bold' }}>{no}</div>
            ))}
        </div>
        <h3>
          hello
          <span style={{ color: 'red', fontWeight: 'bold' }}> world! </span>
        </h3>
      </div>
    );
  }
}

const Age = ({ age, children }) => (
  <div>
    age is {age} {children}
  </div>
);
const Color = ({ color }) => <div>color is {color} </div>;

class App extends Component {
  render() {
    return (
      <div>
        <h2>demo</h2>
        <div>hello rxt</div>
        <span />
      </div>
    );
  }
}

class Demo extends Component {
  constructor() {
    super();
    this.state = {
      number: 0,
    };
    // this.handleClick = this.handleClick.bind(this);
  }
  handleClick = () => {
    console.log('click');
    this.setState({
      number: this.state.number + 1,
    });
  };
  render() {
    return (
      <div>
        <h3>{this.state.number}</h3>
        <button
          onClick={this.handleClick}
        >
          click
        </button>
      </div>
    );
  }
}

// const demo = 'hello rxt'
const demo = (
  <div>
    <h2>demo</h2>
    <div>hello rxt</div>
    <div>{arr.map(i => <div>{i}</div>)}</div>
    <span />
  </div>
);

// render(<App />, document.getElementById('root'));
// render(<Age age='12' >hahaha</Age>, document.getElementById('root'));
// render(<Demo />, document.getElementById('root'));
// render(demo, document.getElementById('root'));
render(<Hello arr={arr} name='xp' />, document.getElementById('root'));
