import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  static defaultProps = {
    numJokes: 10
  }

  constructor(props) {
    super(props)
    this.state = {
      jokes: []
    }

    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.resetVotes = this.resetVotes.bind(this)
    this.vote = this.vote.bind(this)
  }

  // When component mounts, get jokes

  componentDidMount() {
    this.state.jokes.length < this.props.numJokes ? 
    this.getJokes() : null
  }

  componentDidUpdate() {
    this.state.jokes.length < this.props.numJokes ?
    this.getJokes() : null
  }

  // Call API to get jokes

  async getJokes() {
    try {
      let jokes = this.state.jokes
      let jokeVotes = JSON.parse(
        localStorage.getItem("jokeVotes") || "{}"
      )
      let seenJokes = new Set(jokes.map(j => j.id))

      while (jokes.length < this.props.numJokes) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        })

        let { status, ...joke } = res.data

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id)
          jokeVotes[joke.id] = jokeVotes[joke.id] || 0
          jokes.push({...joke, votes: jokeVotes[joke.id]})
        } 
        
        else {
          console.log("Duplicate joke found")
        }
      }
      this.setState({ jokes })
      localStorage.setItem("jokeVotes", JSON.stringify(jokeVotes))
    }

    catch(e) {
      console.error(e)
    }
  }

  generateNewJokes() {
    this.setState(st => ({
      jokes: st.jokes.map(joke => ({ ...joke, votes: 0 }))
    }))
  }

  
}

export default JokeList;
