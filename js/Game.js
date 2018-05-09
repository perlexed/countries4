
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Runner from './components/Runner';
import ActionType from '../enums/ActionType';
import History from './History';
import TimeHelper from './helpers/TimeHelper';
import ActionLogger from './components/ActionLogger';
import CountryProvider from './components/CountryProvider';
import GameMode from "../enums/GameMode";

class Game extends React.Component {

    static propTypes = {
        runnerStatus: PropTypes.string,
        userUid: PropTypes.string,
        runner: PropTypes.instanceOf(Runner),
        store: PropTypes.object,
        actionLogger: PropTypes.instanceOf(ActionLogger),
        countryProvider: PropTypes.instanceOf(CountryProvider),
        gameMode: PropTypes.oneOf([GameMode.MIN2, GameMode.MIN10]),
    };

    constructor(props) {
        super(props);

        this.state = {
            countriesInput: '',
            inputBlink: null,
        };

        this.onCountrySubmit = this.onCountrySubmit.bind(this);
    }

    onCountrySubmit(event) {
        event.preventDefault();

        if (this.props.runnerStatus === Runner.STATUS_FINISHED) {
            return;
        }

        if (!this.state.countriesInput) {
            return;
        }

        if (this.props.runnerStatus === Runner.STATUS_IDLE) {
            this.props.runner.start();
        }

        const matchedCountryCode = this.props.countryProvider.check(this.state.countriesInput);
        const isDuplicate = matchedCountryCode && this.props.matchedCountries.indexOf(matchedCountryCode) !== -1;

        const checkResult = !matchedCountryCode
            ? 'error'
            : (isDuplicate
                ? 'duplicate'
                : 'success'
            );

        if (checkResult !== 'duplicate') {
            const actionType = checkResult === 'error'
                ? ActionType.COUNTRY_FAIL_SUBMIT
                : ActionType.COUNTRY_SUCCESS_SUBMIT;

            this.props.actionLogger.logAction(
                actionType,
                this.props.gameMode,
                checkResult === 'error' ? this.state.countriesInput : matchedCountryCode
            );
        }

        this.inputFieldBlink(checkResult);

        if (matchedCountryCode && !isDuplicate) {
            this.props.onCountryMatch(matchedCountryCode);

            this.setState({
                countriesInput: '',
            });
        }

    }

    render() {
        const isHistoryPresent = this.props.history && Object.keys(this.props.history).length > 0;

        return (
            <div className='row'>
                <div className={isHistoryPresent ? 'col-md-7' : 'col-md-12'}>
                    {this.renderGameForm()}

                    {this.renderTimer()}

                    {this.renderMatchedCountries()}

                    {this.renderRestCountries()}
                </div>

                {isHistoryPresent && (
                    <div className='col-md-5'>
                        <History history={this.props.history}/>
                    </div>
                )}
            </div>
        );
    }

    renderGameForm() {
        return (
            <form
                className='country-form'
                onSubmit={this.onCountrySubmit}
            >
                <div className='form-group'>
                    <label>Введите страну</label>
                    <input
                        className={cn(['form-control', this.state.inputBlink !== null && 'blink-' + this.state.inputBlink])}
                        type='text'
                        value={this.state.countriesInput}
                        disabled={this.props.runnerStatus === Runner.STATUS_FINISHED}
                        onChange={event => {
                            this.setState({
                                countriesInput: event.target.value,
                            });
                        }}
                    />
                </div>

                <button type='submit' className='btn btn-default'>Отправить</button>

                {this.props.runnerStatus === Runner.STATUS_RUNNING && (
                    <button className='btn btn-default stop-button' onClick={() => {
                        this.props.runner.stop();
                    }}>Закончить</button>
                )}

                {this.props.runnerStatus === Runner.STATUS_FINISHED && (
                    <button className='btn btn-default reset-button' onClick={() => {
                        this.props.resetGame();
                        this.props.runner.reset();
                    }}>Начать снова</button>
                )}

                {this.renderGameModeSwitcher()}
            </form>
        );
    }

    renderTimer() {
        if (this.props.runnerStatus === Runner.STATUS_IDLE) {
            return null;
        }

        if (this.props.runnerStatus === Runner.STATUS_FINISHED) {
            return (<h4>Время вышло</h4>);
        }

        const getEnumerableEnding = number => {
            const digit = number.toString()[number.toString().length - 1];

            if (digit === '1') {
                return 'а';
            }

            if (['0', '5', '6', '7', '8', '9'].indexOf(digit) !== -1) {
                return '';
            }

            return 'ы';
        };

        const timeObject = TimeHelper.getFormattedTime(this.props.runner.getTimeLimit() - this.props.elapsedTime);
        const minutesString = timeObject.minutes
            ? ' ' + timeObject.minutes + ' минут' + getEnumerableEnding(timeObject.minutes)
            : '';
        const secondsString = timeObject.seconds + ' секунд' + getEnumerableEnding(timeObject.seconds);

        return (<h4>Осталось времени:{minutesString} {secondsString}</h4>);
    }

    renderGameModeSwitcher() {
        const onGameModeChange = gameMode => {
            this.props.setGameMode(gameMode);
        };

        const isDisabled = this.props.runnerStatus !== Runner.STATUS_IDLE;
        const inputGroupClass = cn(['radio', isDisabled ? 'disabled' : false]);

        return (
            <div className='pull-right' style={{
                display: 'inline-block',
            }}>
                <div className={inputGroupClass}>
                    <label>
                        <input
                            type="radio"
                            disabled={isDisabled}
                            checked={this.props.gameMode === GameMode.MIN2}
                            onChange={() => {
                                onGameModeChange(GameMode.MIN2);
                            }}
                        />
                        2 минуты
                    </label>
                </div>
                <div className={inputGroupClass}>
                    <label>
                        <input
                            type="radio"
                            disabled={isDisabled}
                            checked={this.props.gameMode === GameMode.MIN10}
                            onChange={() => {
                                onGameModeChange(GameMode.MIN10);
                            }}
                        />
                        10 минут
                    </label>
                </div>
            </div>
        );
    }

    renderRestCountries() {
        if (this.props.runnerStatus !== Runner.STATUS_FINISHED) {
            return null;
        }

        const restCountries = this.props.countryProvider.getRestCountries(this.props.matchedCountries);

        return (
            <div className='rest-countries'>
                <h4>Оставшиеся страны:</h4>
                <div className='rest-countries__container' style={{
                    columnCount: 3,
                }}>
                    {restCountries.map((countryName, id) => (
                        <div key={id}>{countryName}</div>
                    ))}
                </div>
            </div>
        )
    }

    renderMatchedCountries() {
        return (
            <div className='matched-countries-list'>
                {this.props.matchedCountries.map((countryCode, index) => (
                    <div key={index}>{this.props.countryProvider.getByCode(countryCode).name}</div>
                ))}
            </div>
        );
    }

    inputFieldBlink(blinkType) {
        this.setState({
            inputBlink: blinkType,
        });

        setTimeout(() => {
            this.setState({
                inputBlink: null,
            });
        }, 1000);
    }
}

const mapStateToProps = state => {
    return {
        matchedCountries: state.matchedCountries,
        elapsedTime: state.runner.elapsedTime,
        runnerStatus: state.runner.status,
        gameUid: state.runner.gameUid,
        history: state.history,
        gameMode: state.gameMode,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onCountryMatch: countryCode => {
            dispatch({
                type: 'ADD_COUNTRY',
                countryCode: countryCode,
            });
        },
        resetGame: () => {
            dispatch({
                type: 'RESET_COUNTRIES',
            })
        },
        setGameMode: gameMode => {
            dispatch({
                type: 'SET_GAME_MODE',
                gameMode: gameMode,
            });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);