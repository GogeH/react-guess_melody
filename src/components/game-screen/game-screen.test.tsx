import { render, screen } from '@testing-library/react';
import { Router, Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { configureMockStore } from '@jedmao/redux-mock-store';

import { makeFakeArtistQuestion, makeFakeGenreQuestion } from '../../utils/mocks';
import { AppRoute } from '../../const';
import GameScreen from './game-screen';

const history = createMemoryHistory();
const mockStore = configureMockStore();
const mockGenreQuestion = makeFakeGenreQuestion();
const mockArtist = makeFakeArtistQuestion();

describe('Component: GameScreen', () => {
  beforeAll(() => {
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
    window.HTMLMediaElement.prototype.pause = jest.fn();
  });

  it('should render GenreQuestionScreen', () => {
    const store = mockStore({
      GAME: {step: 0, mistakes: 2},
      DATA: {questions: [mockGenreQuestion]},
    });

    const expectedGenre = mockGenreQuestion.genre;

    render(
      <Provider store={store}>
        <Router history={history}>
          <GameScreen />
        </Router>
      </Provider>);

    expect(screen.getByText(new RegExp(`Выберите ${expectedGenre} треки`, 'i'))).toBeInTheDocument();
    expect(screen.queryByText(/Кто исполняет эту песню/i)).not.toBeInTheDocument();
  });

  it('should render ArtistQuestionScreen', () => {
    const store = mockStore({
      GAME: {step: 0, mistakes: 2},
      DATA: {questions: [mockArtist]},
    });

    render(
      <Provider store={store}>
        <Router history={history}>
          <GameScreen />
        </Router>
      </Provider>);

    expect(screen.queryByText(/Кто исполняет эту песню/i)).toBeInTheDocument();
    expect(screen.queryByText(/Выберите rock треки/i)).not.toBeInTheDocument();
  });

  it('should redirect to "/lose" because mistakes > MAX_MISTAKES', () => {
    const store = mockStore({
      GAME: {step: 0, mistakes: 10},
      DATA: {questions: [mockArtist]},
    });

    history.push(AppRoute.Game);
    render(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path={AppRoute.Lose}>
              <h1>Lose screen</h1>
            </Route>
            <GameScreen />
          </Switch>
        </Router>
      </Provider>);

    expect(screen.getByText(/Lose screen/i)).toBeInTheDocument();
  });

  it('should redirect to "/result" because step > questions count', () => {
    const store = mockStore({
      GAME: {step: 10, mistakes: 0},
      DATA: {questions: [mockArtist]},
    });

    render(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path={AppRoute.Lose}>
              <h1>Result screen</h1>
            </Route>
            <GameScreen />
          </Switch>
        </Router>
      </Provider>);

    expect(screen.getByText(/Result screen/i)).toBeInTheDocument();
  });

  it('should redirect to "/" because unknown question type', () => {
    const store = mockStore({
      GAME: {step: 0, mistakes: 0},
      DATA: {questions: [{}]},
    });

    history.push(AppRoute.Game);

    render(
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path={AppRoute.Root}>
              <h1>Root screen</h1>
            </Route>
            <GameScreen />
          </Switch>
        </Router>
      </Provider>);

    expect(screen.getByText(/Root screen/i)).toBeInTheDocument();
  });
});
