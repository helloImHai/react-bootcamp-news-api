const express = require('express');
const stories = require('./stories');
const request = require('request');
const path = require('path');

const app = express();

app.use((req, res, next)=> {
    console.log("Request details. Method:", req.method, "Original url", req.originalUrl);
    next();
});

app.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/ping', (req, res) => {
    res.send('pong!');
});

app.get('/stories', (req, res) => {
    res.json(stories);
});

app.get('/stories/:title', (req, res) => {
    const { title } = req.params;
    res.json(stories.filter(story => story.title.includes(title)));
});

// https://hacker-news.firebaseio.com/v0/topstories.json

app.get('/newstories', (req, res, next) => {
    request(
        { url: 'https://hacker-news.firebaseio.com/v0/newstories.json' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return next(new Error('Error requesting new stories'));
            }
            const newStories = JSON.parse(body);
            const limit = 20;
            
            Promise.all(
                newStories.slice(0, limit).map(story => { 
                    return new Promise((resolve, reject) => {
                        request(
                            {url: `https://hacker-news.firebaseio.com/v0/item/${story}.json`},
                            (error, response, body) => {
                                if (error || response.statusCode !== 200) {
                                    return reject(new Error('Error requesting story item'));
                                }
                                resolve(JSON.parse(body));
                            }
                        );
                    })
                })
            )
            .then(fullNewStories => {
                res.json(fullNewStories);
            })
            .catch(error => next(error));
        }    
    );
});

app.get('/topstories', (req, res, next) => {
    request(
        { url: 'https://hacker-news.firebaseio.com/v0/topstories.json' },
        (error, response, body) => {
            if (error || response.statusCode !== 200) {
                return next(new Error('Error requesting top stories'));
            }
            const topStories = JSON.parse(body);
            const limit = 20;
            
            Promise.all(
                topStories.slice(0, limit).map(story => { 
                    return new Promise((resolve, reject) => {
                        request(
                            {url: `https://hacker-news.firebaseio.com/v0/item/${story}.json`},
                            (error, response, body) => {
                                if (error || response.statusCode !== 200) {
                                    return reject(new Error('Error requesting story item'));
                                }
                                resolve(JSON.parse(body));
                            }
                        );
                    })
                })
            )
            .then(fullTopStories => {
                res.json(fullTopStories);
            })
            .catch(error => next(error));
        }    
    );
});

app.use((err, req, res, next) => {
    console.log('err', err);
    res.status(500).json({type: 'error', message: err.message}, );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});