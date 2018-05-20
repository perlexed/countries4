
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {Collapse} from 'react-collapse';

import Runner from './components/Runner';
import ActionType from '../enums/ActionType';
import TimeHelper from './helpers/TimeHelper';
import ActionLogger from './components/ActionLogger';
import CountryProvider from './components/CountryProvider';
import GameMode from '../enums/GameMode';

import History from './views/History';
import Statistics from './views/Statistics';
import MatchedCountries from './views/MatchedCountries';
import RestCountries from './views/RestCountries';

class Game extends React.Component {

    static propTypes = {
        runnerStatus: PropTypes.string,
        userUid: PropTypes.string,
        runner: PropTypes.instanceOf(Runner),
        store: PropTypes.object,
        actionLogger: PropTypes.instanceOf(ActionLogger),
        gameMode: PropTypes.oneOf([GameMode.MIN2, GameMode.MIN10]),
        statistics: PropTypes.object,
        infoPanelSwitch: PropTypes.oneOf(['stats', 'history']),
        matchedCountries: PropTypes.array,
    };

    constructor(props) {
        super(props);

        this.state = {
            countriesInput: '',
            inputBlink: null,
            isDescriptionOpened: true,
        };

        this.onCountrySubmit = this.onCountrySubmit.bind(this);
    }

    onCountrySubmit(event) {
        event.preventDefault();

        this.setState({
            isDescriptionOpened: false,
        });

        if (this.props.runnerStatus === Runner.STATUS_FINISHED) {
            return;
        }

        if (!this.state.countriesInput) {
            return;
        }

        if (this.props.runnerStatus === Runner.STATUS_IDLE) {
            this.props.runner.start();
        }

        const checkResultData = CountryProvider.checkCountryName(this.state.countriesInput);
        const matchedCountryCode = checkResultData.result;
        const isDuplicate = matchedCountryCode && this.props.matchedCountries.indexOf(matchedCountryCode) !== -1;

        const checkResult = !matchedCountryCode
            ? 'error'
            : (isDuplicate
                // If match is not exact, then don't mark input as duplicate
                // so that it won't match wrongfully spelled country as other country.
                ? (!checkResultData.exactMatch
                        ? 'error'
                        : 'duplicate'
                )
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

        // Blink input field
        this.setState({
            inputBlink: checkResult,
        });

        setTimeout(() => {
            this.setState({
                inputBlink: null,
            });
        }, 1000);


        if (matchedCountryCode && !isDuplicate) {
            this.props.onCountryMatch(matchedCountryCode);

            this.setState({
                countriesInput: '',
            });
        }

    }

    render() {
        const isHistoryPresent = this.props.history && Object.keys(this.props.history).length > 0;
        const showStatistics = this.props.infoPanelSwitch === 'stats';
        const toggleDescription = e => {
            e.preventDefault();
            this.setState({
                isDescriptionOpened: !this.state.isDescriptionOpened,
            })
        };

        return (
            <div className='row'>
                <h1 className='text-center main-header'
                >
                    <a
                        href='#'
                        onClick={toggleDescription}
                    >Страноведение</a>
                </h1>

                <Collapse isOpened={this.state.isDescriptionOpened}>
                    <section className='text-center description-text'>
                        <p>Цель игры - за ограниченное време указать как можно больше названий стран</p>
                        <p>Указывать следует полное название страны, но для многих стран поддерживается сокращенный вариант написания</p>
                        <p>Отсчет времени начнется сразу после того, как будет введено и отправлено название любой страны</p>
                    </section>
                </Collapse>

                <div className='col-md-7 game-block'>
                    {this.renderGameForm()}

                    {this.renderTimer()}

                    <MatchedCountries
                        countriesList={this.props.matchedCountries}
                    />

                    {this.props.runnerStatus === Runner.STATUS_FINISHED && (
                        <RestCountries
                            countriesList={this.props.matchedCountries}
                        />
                    )}
                </div>

                <div className='col-md-5 stats-block'>
                    <div className='nav nav-tabs'>
                        <li
                            role='presentation'
                            className={showStatistics ? 'active' : ''}
                        >
                            <a
                                href='#'
                                onClick={e => {
                                    e.preventDefault();
                                    this.props.toggleInfoPanel('stats');
                                }}
                            >Статистика</a>
                        </li>
                        {isHistoryPresent && (
                            <li
                                role='presentation'
                                className={!showStatistics ? 'active' : ''}
                            >
                                <a
                                    href='#'
                                    onClick={e => {
                                        e.preventDefault();
                                        this.props.toggleInfoPanel('history');
                                    }}
                                >История игр</a>
                            </li>
                        )}
                    </div>
                    {showStatistics ? (
                        <Statistics
                            statistics={this.props.statistics}
                        />
                    ) : (
                        <History history={this.props.history}/>
                    )}
                </div>
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

                {this.props.runnerStatus !== Runner.STATUS_FINISHED && (
                    <button type='submit' className='btn btn-default send-button'>Отправить</button>
                )}

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
            return (
                <div className='timer-block'>
                    <h4>Время вышло</h4>
                </div>
            );
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

        return (
            <div className='timer'>
                <div className='timer__label'>Осталось времени:</div>
                <div className='timer__numbers'>{minutesString} {secondsString}</div>
            </div>
        );
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
}

const mapStateToProps = state => {
    return {
        matchedCountries: state.matchedCountries,
        elapsedTime: state.runner.elapsedTime,
        runnerStatus: state.runner.status,
        gameUid: state.runner.gameUid,
        history: state.history,
        gameMode: state.gameMode,
        statistics: state.statistics,
        infoPanelSwitch: state.infoPanelSwitch,
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
        },
        toggleInfoPanel: infoPanelName => {
            dispatch({
                type: 'TOGGLE_INFO_PANEL',
                infoPanelName: infoPanelName,
            })
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);