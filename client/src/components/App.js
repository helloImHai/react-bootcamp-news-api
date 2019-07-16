import React, { Component } from 'react';

class App extends Component {
  state = {stories: []};

  componentDidMount() {
    fetch(`${document.location.origin}/topstories`)
      .then(response => response.json())
      .then(json => this.setState({stories: json}))
      .catch(error => alert(error));
  }

  render() {
    return (
      <div>
        <h2>The Latest Hacker News</h2>
        <br/>
        {
          this.state.stories.map(story => {
            const {id, title, url, by, score} = story;
            return (
                <div id={id}>
                  <a href={url}><h3>{title}</h3></a>
                  <p>upvotes: {score}</p>
                  <p>- {by} -</p>
                </div>
              );
          })
        }
      </div>
    );
  }
}

export default App;
