import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import { axiosWithAuth } from "../axios";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState("");
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate("/");
  };
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
    redirectToLogin();
    setMessage("Goodbye!");
  };

  const login = ({ username, password }) => {
    setMessage("");
    setSpinnerOn(true);
    console.log({ username, password });
    axios
      .post(loginUrl, { username, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err));
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  };

  const getArticles = () => {
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .get(articlesUrl)
      .then((res) => {
        setArticles(res.data.articles);
        setMessage(res.data.message);
      })
      .catch((err) => console.log(err));
    setSpinnerOn(false);
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  };

  const postArticle = (article) => {
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((res) => {
        console.log(res);
        setArticles([...articles, res.data.article]);
        setMessage(res.data.message);
      })
      .catch((err) => console.log(err));
    setSpinnerOn(false);
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  };

  const updateArticle = ( article_id, article ) => {
    console.log('from update Artcicle', article_id);
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((res) => console.log(res), console.log(article_id))
      .catch((err) => console.log(err));
  };

  const deleteArticle = (article_id) => {};

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  currentArticleId={currentArticleId}
                  updateArticle={updateArticle}
                  getArticles={getArticles}
                />
                <Articles
                  getArticles={getArticles}
                  articles={articles}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}

// [7] Clicking edit button populates the article information into the form, Review how to manipulate and use state and reset a form using initial values. (33 ms)
// [8] Editing the form values and submitting
//         - updates the edited article on the page
//         - resets the form
//         - a success message renders on the page
//         - Review how to utilize state to set current values.
//         -  Review how to make PUT requests to an external API using Axios and how to manipulate    and use state. (216 ms)
//     Deleting an existing article
// [9] Clicking delete button on an article
//         - removes it from the page
//         - a success message renders on the page
//         - Review how to make DELETE requests to an external API using Axios. (760 ms)
