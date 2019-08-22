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
        <p>Try /topstories for top stories</p>
        <p>Try /newstories for new stories</p>
        <br/>
        <h2>The Hottest Hacker News</h2>
        <br/>
        {
          this.state.stories.map(story => {
            const {id, title, url, by, score, time} = story;
            return (
                <div id={id}>
                  <a href={url}><h3>{title}</h3></a>
                  <p>upvotes: {score}</p>
                  <p>- {by} -</p>
                  <p>
                    {timeConvert(time)}
                  </p>
                </div>
              );
          })
        }
      </div>
    );
  }
}

function timeConvert(t) {
  var time = new Date(t * 1000);
  console.log('time', time);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = time.getFullYear();
  var month = months[time.getMonth()];
  var date = time.getDate();
  return date + ' ' + month + ' ' + year;
}

export default App;
