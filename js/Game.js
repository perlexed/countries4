
import React from 'react';
import { connect } from 'react-redux';
import Runner from './Runner';
import CountryProvider from './CountryProvider';
import PropTypes from 'prop-types';
import ActionLogger from './ActionLogger';

class Game extends React.Component {

    static propTypes = {
        runnerStatus: PropTypes.string,
        userUid: PropTypes.string,
        runner: PropTypes.object,
        actionLogger: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            countriesInput: '',
            inputBlink: null,
        };

        this.countryProvider = new CountryProvider();

        this.onCountrySubmit = this.onCountrySubmit.bind(this);
    }

    onCountrySubmit(event) {
        event.preventDefault();

        this.props.actionLogger._getGameUid();

        if (this.props.runnerStatus === Runner.STATUS_FINISHED) {
            return;
        }

        if (!this.state.countriesInput) {
            return;
        }

        if (this.props.runnerStatus === Runner.STATUS_IDLE) {
            this.props.runner.start();
        }

        const matchedCountryCode = this.countryProvider.check(this.state.countriesInput);
        const isDuplicate = matchedCountryCode && this.props.matchedCountries.indexOf(matchedCountryCode) !== -1;

        const checkResult = !matchedCountryCode
            ? 'error'
            : (isDuplicate
                ? 'duplicate'
                : 'success'
            );

        if (checkResult !== 'duplicate') {
            const actionType = checkResult === 'error'
                ? ActionLogger.COUNTRY_FAIL_SUBMIT
                : ActionLogger.COUNTRY_SUCCESS_SUBMIT;

            this.props.actionLogger.logAction(
                actionType,
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
        const blinkClass = this.state.inputBlink === null
            ? '' :
            'blink-' + this.state.inputBlink;

        return (
            <div>
                <form
                    className='country-form'
                    onSubmit={this.onCountrySubmit}
                >
                    <div className='form-group'>
                        <label>Введите страну</label>
                        <input
                            className={'form-control' + (blinkClass ? ' ' + blinkClass : '')}
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

                    <button
                        type='submit'
                        className='btn btn-default'
                    >Отправить</button>


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
                </form>

                {this.renderTimer()}
                {this.renderMatchedCountries()}

                {this.renderRestCountries()}
            </div>
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

        const timeObject = Game.getFormattedTime(Runner.timeLimit - this.props.elapsedTime);
        const minutesString = timeObject.minutes
            ? ' ' + timeObject.minutes + ' минут' + getEnumerableEnding(timeObject.minutes)
            : '';
        const secondsString = timeObject.seconds + ' секунд' + getEnumerableEnding(timeObject.seconds);

        return (<h4>Осталось времени:{minutesString} {secondsString}</h4>);
    }

    static getFormattedTime(seconds) {
        return {
            minutes: Math.floor(seconds / 60),
            seconds: seconds % 60,
        };
    }

    renderRestCountries() {
        if (this.props.runnerStatus !== Runner.STATUS_FINISHED) {
            return null;
        }

        const restCountries = this.countryProvider.getRestCountries(this.props.matchedCountries);

        return (
            <div className={'rest-countries'}>
                <h4>Оставшиеся страны:</h4>
                <div className={'rest-countries__container'} style={{
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
                    <div key={index}>{this.countryProvider.getByCode(countryCode).name}</div>
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

const mapStateToProps = (state, ownProps) => {
    return {
        matchedCountries: state.matchedCountries,
        elapsedTime: state.runner.elapsedTime,
        runnerStatus: state.runner.status,
        gameUid: state.runner.gameUid,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
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
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);