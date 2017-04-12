import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';

var Root;

const initialState = { username: 'ughitsaaron' };

const reducer = function (state = initialState, action) {
  if (action.type === 'SET_USERNAME') {
    return Object.assign({}, state, { username: action.username });
  }

  return state;
};

const store = createStore(reducer);

class Application extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { setUsername } = this.props;

    return (
      <div>
        <h1>Repositories</h1>
        <input onChange={e => setUsername(e.target.value)} />
        <Repositories {...this.props} />
      </div>
    );
  }
}

function Repositories({ username }) {
  // eslint-disable-next-line max-len
  const PromisedRepositoriesList = Promised(RepositoriesList);

  return (
    <div>
      <h2>GitHub projects by { username }</h2>
      <PromisedRepositoriesList promise={getRepos(username)} />
    </div>
  );
}

function mapStateToProps(store) {
  return {
    username: store.username
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUsername: function (username) {
      dispatch({
        type: 'SET_USERNAME',
        username: username
      });
    }
  };
}

function getRepos(username) {
  if (username.length > 5) {
    return fetch('https://api.github.com/search/repositories?q=user:' + username)
      .then(res => res.json())
      .then(res => res.items);
  }
}

function Promised(WrappedComponent) {
  return class PromiseWrapper extends Component {
    constructor(props) {
      super(props);

      this.state = { data: null, error: null };
    }

    componentDidMount() {
      const { promise } = this.props;

      if (promise) {
        promise.then(
          data => this.setState({ data: data }),
          err => this.setState({ error: err })
        );
      }
    }

    render() {
      return <WrappedComponent
        data={this.state.data}
        error={this.state.error}
        {...this.props} />;
    }
  };
}

function RepositoriesList({ data, error }) {
  if (error) {
    return <h2>There was an error</h2>;
  }

  if (!data) {
    return <h2>Loading ...</h2>;
  } else {
    return <ul>{ data.map(mapRepositories) }</ul>;
  }
}

function mapRepositories(repository, index) {
  return <li key={index}>{ repository.name }</li>;
}

Root = connect(mapStateToProps, mapDispatchToProps)(Application);

render(
  <Provider store={store}><Root /></Provider>, document.getElementById('app')
);
