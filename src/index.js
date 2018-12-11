import createElement from './createElement';
import render from './render';
import Component from './component';

const React = { createElement, Component };
const ReactDOM = { render };

const arr = ['no1', 'no2', 'no3'];

class Hello extends Component {
  render() {
    return (
      <div
        className="bg"
        onClick={() => {
          console.log('click');
        }}
      >
        {this.props.name}
        <div>{this.props.children}</div>
        <div>{this.props.arr && this.props.arr.map(no => <div>{no}</div>)}</div>
        <h3>
          hello
          <span style={{ color: 'red', fontWeight: 'bold' }}> world! </span>
        </h3>
      </div>
    );
  }
}

const Hi = ({ color, age }) => <div>hi function component, {age} {color}</div>;

class App extends Component {
  render() {
    return (
      <div>
        <h2>app</h2>
        <Hi age="12" color="red"/>
        <Hi age="18" color="blue"/>
        <Hello name="xp" arr={arr}>
          aaaa
        </Hello>
        <Hello name="hanpei">bbb</Hello>
        <Hello />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
