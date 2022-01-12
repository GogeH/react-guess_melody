import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { resetGame } from '../../store/action';
import { AppRoute } from '../../const';

type WelcomeScreenProps = {
  errorsCount: number;
};

function WelcomeScreen(props: WelcomeScreenProps): JSX.Element {
  const {errorsCount} = props;

  const history = useHistory();
  const dispatch = useDispatch();

  return (
    <section className="welcome">
      <div className="welcome__logo">
        <img src="img/melody-logo.png" alt="Угадай мелодию" width="186" height="83"/>
      </div>
      <button
        className="welcome__button"
        onClick={() => {
          dispatch(resetGame());
          history.push(AppRoute.Game);
        }}
      >
        <span className="visually-hidden">
          Начать игру
        </span>
      </button>
      <h2 className="welcome__rules-title">Правила игры</h2>
      <p className="welcome__text">Правила просты:</p>
      <ul className="welcome__rules-list">
        <li>Нужно ответить на все вопросы.</li>
        <li>Можно допустить {errorsCount} ошибки.</li>
      </ul>
      <p className="welcome__text">Удачи!</p>
    </section>
  );
}

export default WelcomeScreen;
