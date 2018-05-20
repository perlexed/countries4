
import React from 'react';
import PropTypes from 'prop-types';
import cn from "classnames";

import Runner from "../components/Runner";
import ActionType from "../../enums/ActionType";
import CountryProvider from "../components/CountryProvider";
import GameMode from "../../enums/GameMode";
import ActionLogger from "../components/ActionLogger";

export default class InputForm extends React.Component {

    static propTypes = {
        runnerStatus: PropTypes.string,
        runner: PropTypes.instanceOf(Runner),
        resetGame: PropTypes.func,
        matchedCountries: PropTypes.array,
        actionLogger: PropTypes.instanceOf(ActionLogger),
        gameMode: PropTypes.oneOf([GameMode.MIN2, GameMode.MIN10]),
        setGameMode: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            countriesInput: '',
            inputBlink: null,
        };

        this._onCountrySubmit = this._onCountrySubmit.bind(this);
    }

    render() {
        return (
            <form
                className='country-form'
                onSubmit={this._onCountrySubmit}
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

    _onCountrySubmit(event) {
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