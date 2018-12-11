import createElement from './createElement';
import render from './render';
import Component from './component';

const React = { createElement, Component };
const ReactDOM = { render };

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
        <br />
        123123
        <h3>
          hello
          <span style={{ color: 'red', fontWeight: 'bold' }}> world! </span>
        </h3>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <h2>app</h2>
        <Hello name="xp">aaaa</Hello>
        <Hello name="hanpei">bbb</Hello>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
