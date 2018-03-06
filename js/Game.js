
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Runner from './Runner';
import CountryProvider from './CountryProvider';

class Game extends React.Component {

    constructor() {
        super(...arguments);

        this.state = {
            countriesInput: '',
            inputBlink: null,
        };

        this.countryProvider = new CountryProvider();

        this.runner = new Runner(this.props.store);

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
            this.runner.start();
        }

        const matchedCountryCode = this.countryProvider.check(this.state.countriesInput);
        const isDuplicate = matchedCountryCode && this.props.matchedCountries.indexOf(matchedCountryCode) !== -1;

        const blinkType = !matchedCountryCode
            ? 'error'
            : (isDuplicate
                ? 'duplicate'
                : 'success'
            );

        this.inputFieldBlink(blinkType);

        if (matchedCountryCode && !isDuplicate) {
            this.props.onCountryMatch(matchedCountryCode);

            this.setState({
                countriesInput: '',
            });
        }

        // axios.post('/game/api-send-country/', {
        //     _csrf: window.yii.getCsrfToken(),
        //     country: this.state.countriesInput,
        // }, {
        //     responseType: 'json',
        // })
        // .then(response => {
        //     const responseData = response && response.data ? response.data : null;
        // })
        // .catch(error => {
        //     console.log(error);
        // });
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


                    {this.runner.status === Runner.STATUS_RUNNING && (
                        <button className='btn btn-default stop-button' onClick={() => {
                            this.runner.stop();
                        }}>Закончить</button>
                    )}

                    {this.runner.status === Runner.STATUS_FINISHED && (
                        <button className='btn btn-default reset-button' onClick={() => {
                            this.props.resetGame();
                            this.runner.reset();
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